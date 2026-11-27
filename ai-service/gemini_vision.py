"""
AgriCycle - Gemini Vision API Integration & Computer Vision Fallback
Analyzes agricultural waste images for visible physical characteristics,
category identification, and visual quality indicators.
"""

import os
import io
import json
import base64
import logging
import urllib.request
import urllib.error
from typing import Dict, Any, Optional
import numpy as np
from PIL import Image

logger = logging.getLogger("agricycle-ai")

# Supported agricultural waste categories according to AgriCycle specifications
SUPPORTED_CATEGORIES = [
    "Rice Straw",
    "Wheat Straw",
    "Sugarcane Bagasse",
    "Coconut Husk",
    "Groundnut Shells",
    "Corn Stalks",
    "Banana Waste",
    "Areca Leaf",
    "Cotton Stalk",
    "Other Agricultural Residues",
]

# Aliases to normalize variations
CATEGORY_ALIASES = {
    "paddy straw": "Rice Straw",
    "rice straw": "Rice Straw",
    "wheat straw": "Wheat Straw",
    "sugarcane bagasse": "Sugarcane Bagasse",
    "bagasse": "Sugarcane Bagasse",
    "coconut husk": "Coconut Husk",
    "coir": "Coconut Husk",
    "groundnut shells": "Groundnut Shells",
    "peanut shells": "Groundnut Shells",
    "groundnut husk": "Groundnut Shells",
    "corn stalks": "Corn Stalks",
    "corn stover": "Corn Stalks",
    "maize stalk": "Corn Stalks",
    "banana waste": "Banana Waste",
    "banana residue": "Banana Waste",
    "banana pseudostem": "Banana Waste",
    "areca leaf": "Areca Leaf",
    "areca leaf sheaths": "Areca Leaf",
    "areca palm": "Areca Leaf",
    "cotton stalk": "Cotton Stalk",
    "cotton biomass": "Cotton Stalk",
}

def normalize_category(detected_name: str) -> str:
    """Normalize detected category name to official AgriCycle taxonomy."""
    clean = (detected_name or "").strip().lower()
    for alias, official in CATEGORY_ALIASES.items():
        if alias in clean:
            return official
    for cat in SUPPORTED_CATEGORIES:
        if cat.lower() in clean:
            return cat
    return "Other Agricultural Residues"


def analyze_with_heuristic_cv(image_bytes: bytes, filename: str = "crop.jpg") -> Dict[str, Any]:
    """
    Local Computer Vision Heuristic Fallback:
    Used when GEMINI_API_KEY is not configured or external API is temporarily unreachable.
    Inspects image spectrum, texture variance, and surface brightness without claiming to measure internal moisture.
    """
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((224, 224))
        arr = np.array(img, dtype=np.float32) / 255.0

        r_mean = float(np.mean(arr[:, :, 0]))
        g_mean = float(np.mean(arr[:, :, 1]))
        b_mean = float(np.mean(arr[:, :, 2]))

        gray = 0.2989 * arr[:, :, 0] + 0.5870 * arr[:, :, 1] + 0.1140 * arr[:, :, 2]
        brightness = float(np.mean(gray))

        dx = np.diff(gray, axis=1)
        dy = np.diff(gray, axis=0)
        texture_var = float(np.var(dx) + np.var(dy))

        greenness = float(g_mean / (r_mean + g_mean + b_mean + 1e-6))
        excess_green = max(0.0, g_mean - r_mean)

        # Spectral classification heuristic
        if greenness > 0.40 and excess_green > 0.04:
            detected_type = "Areca Leaf"
            color_desc = "Greenish-brown palm sheath"
        elif r_mean > 0.42 and g_mean > 0.32 and b_mean < 0.25:
            detected_type = "Rice Straw"
            color_desc = "Light golden yellow"
        elif r_mean > 0.38 and g_mean < 0.28 and b_mean < 0.20:
            detected_type = "Coconut Husk"
            color_desc = "Fibrous reddish brown"
        elif brightness > 0.52 and abs(r_mean - g_mean) < 0.12:
            detected_type = "Sugarcane Bagasse"
            color_desc = "Pale straw white"
        elif brightness > 0.45 and r_mean > 0.36:
            detected_type = "Wheat Straw"
            color_desc = "Golden tan"
        elif texture_var > 0.04 and r_mean > 0.28:
            detected_type = "Cotton Stalk"
            color_desc = "Woody brown stalk"
        elif r_mean > 0.35 and g_mean > 0.30 and b_mean > 0.20:
            detected_type = "Groundnut Shells"
            color_desc = "Beige-tan brittle husk"
        elif excess_green > 0.02 and brightness > 0.38:
            detected_type = "Banana Waste"
            color_desc = "Fibrous green-yellow residue"
        else:
            detected_type = "Rice Straw"
            color_desc = "Golden yellow"

        # Visible damage & contamination heuristic from texture irregularity and darkness
        has_dark_spots = bool(np.mean(gray < 0.15) > 0.08)
        visible_damage = "Medium" if texture_var > 0.05 else "Low"
        visible_contamination = "Moderate soil/dust" if has_dark_spots else "Low"
        fungal_growth = "Possible dark spotting" if has_dark_spots and brightness < 0.30 else "Not visibly detected"

        preliminary_grade = "A" if (not has_dark_spots and texture_var < 0.045) else ("B" if not has_dark_spots else "C")
        confidence = round(float(min(0.92, max(0.70, 0.82 + (texture_var * 0.5)))), 2)

        return {
            "waste_type": detected_type,
            "identification_confidence": confidence,
            "visual_observations": {
                "colour": color_desc,
                "visible_condition": "Good" if preliminary_grade == "A" else ("Fair" if preliminary_grade == "B" else "Requires inspection"),
                "visible_damage": visible_damage,
                "visible_contamination": visible_contamination,
                "visible_deterioration": "Surface weathering observed" if preliminary_grade == "C" else "Not detected",
                "fungal_growth": fungal_growth,
            },
            "visual_quality": {
                "preliminary_grade": preliminary_grade,
                "description": f"Visual CV assessment indicates {preliminary_grade}-tier surface cleanliness.",
                "confidence": confidence,
            },
            "warnings": ["Visual heuristic analysis only. Actual moisture and quality must be verified by farmer or sensor testing."],
            "recommended_next_steps": [
                "Confirm detected crop category",
                "Provide physical moisture percentage if known",
                "Specify storage conditions (covered/open)",
            ],
            "analysis_source": "Local_Computer_Vision_Heuristic",
        }
    except Exception as e:
        logger.error(f"Heuristic CV analysis error: {e}")
        return {
            "waste_type": "Other Agricultural Residues",
            "identification_confidence": 0.60,
            "visual_observations": {
                "colour": "Undetermined",
                "visible_condition": "Fair",
                "visible_damage": "Low",
                "visible_contamination": "Low",
                "visible_deterioration": "Not detected",
                "fungal_growth": "Not visibly detected",
            },
            "visual_quality": {
                "preliminary_grade": "B",
                "description": "Standard agricultural biomass default.",
                "confidence": 0.60,
            },
            "warnings": ["Please verify the crop category manually."],
            "recommended_next_steps": ["Select waste category manually", "Enter quantity and storage condition"],
            "analysis_source": "Default_Baseline",
        }


def analyze_with_gemini_vision(
    image_bytes: bytes,
    api_key: Optional[str] = None,
    model_name: Optional[str] = None,
    filename: str = "crop.jpg",
) -> Dict[str, Any]:
    """
    Calls the Google Gemini Vision API to analyze agricultural waste image.
    Enforces strict structured JSON output and falls back seamlessly if key is missing or API fails.
    """
    key = api_key or os.getenv("GEMINI_API_KEY")
    model = model_name or os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

    if not key or key.strip() in ("", "your_api_key", "your_gemini_api_key"):
        logger.info("GEMINI_API_KEY not configured. Falling back to local Computer Vision heuristic.")
        return analyze_with_heuristic_cv(image_bytes, filename)

    # Determine MIME type from image bytes header
    mime_type = "image/jpeg"
    if image_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
        mime_type = "image/png"
    elif image_bytes.startswith(b"RIFF") and b"WEBP" in image_bytes[:16]:
        mime_type = "image/webp"

    base64_image = base64.b64encode(image_bytes).decode("utf-8")

    prompt_instruction = (
        "You are an expert agricultural biomass inspector and circular economy specialist for AgriCycle.\n"
        "Analyze this agricultural waste/crop residue image carefully.\n\n"
        "CRITICAL RULES:\n"
        "1. Never guess or claim to accurately measure internal moisture, chemical content, or internal rot from an image alone.\n"
        "2. Only report VISIBLE surface physical characteristics.\n"
        "3. Identify the crop residue from these supported categories: "
        f"{', '.join(SUPPORTED_CATEGORIES)}.\n"
        "4. Return ONLY a valid JSON object matching the exact schema below, without Markdown code fences, backticks, or other text.\n\n"
        "JSON SCHEMA:\n"
        "{\n"
        '  "waste_type": "string (one of the supported categories or closest match)",\n'
        '  "identification_confidence": float between 0.50 and 0.99,\n'
        '  "visual_observations": {\n'
        '    "colour": "short string describing visible color and hue",\n'
        '    "visible_condition": "Good | Fair | Poor",\n'
        '    "visible_damage": "Low | Moderate | High",\n'
        '    "visible_contamination": "Low | Moderate (dust/soil) | High (foreign debris)",\n'
        '    "visible_deterioration": "Not detected | Surface discoloration | Significant rotting",\n'
        '    "fungal_growth": "Not visibly detected | Potential mould spots visible"\n'
        "  },\n"
        '  "visual_quality": {\n'
        '    "preliminary_grade": "A | B | C",\n'
        '    "description": "short 1-2 sentence visual quality explanation",\n'
        '    "confidence": float between 0.50 and 0.99\n'
        "  },\n"
        '  "warnings": ["string warning if material has visible mould, heavy debris, or unclear photo"],\n'
        '  "recommended_next_steps": ["string action items for farmer to verify physical moisture and storage"]\n'
        "}"
    )

    request_payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt_instruction},
                    {
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": base64_image,
                        }
                    },
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.1,
            "topP": 0.8,
            "responseMimeType": "application/json",
        },
    }

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(request_payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        with urllib.request.urlopen(req, timeout=12) as response:
            res_body = response.read().decode("utf-8")
            res_json = json.loads(res_body)

        candidates = res_json.get("candidates", [])
        if not candidates:
            logger.warning("Gemini Vision returned no candidates. Falling back to heuristic.")
            return analyze_with_heuristic_cv(image_bytes, filename)

        part_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
        clean_text = part_text.strip()
        if clean_text.startswith("```json"):
            clean_text = clean_text[7:]
        if clean_text.startswith("```"):
            clean_text = clean_text[3:]
        if clean_text.endswith("```"):
            clean_text = clean_text[:-3]
        clean_text = clean_text.strip()

        parsed = json.loads(clean_text)

        # Validate and normalize
        parsed["waste_type"] = normalize_category(parsed.get("waste_type", "Rice Straw"))
        parsed["identification_confidence"] = float(parsed.get("identification_confidence", 0.85))
        parsed["analysis_source"] = f"Gemini_Vision_{model}"

        # Ensure schema structure integrity
        if "visual_observations" not in parsed:
            parsed["visual_observations"] = {
                "colour": "Golden/Natural",
                "visible_condition": "Good",
                "visible_damage": "Low",
                "visible_contamination": "Low",
                "visible_deterioration": "Not detected",
                "fungal_growth": "Not visibly detected",
            }

        if "visual_quality" not in parsed:
            parsed["visual_quality"] = {
                "preliminary_grade": "A",
                "description": "Material appears in good visible condition.",
                "confidence": 0.85,
            }

        return parsed

    except urllib.error.HTTPError as http_err:
        err_msg = http_err.read().decode("utf-8", errors="ignore")
        logger.warning(f"Gemini Vision API HTTP error ({http_err.code}): {err_msg[:200]}. Falling back to heuristic.")
        fallback = analyze_with_heuristic_cv(image_bytes, filename)
        fallback["warnings"].append(f"AI cloud service returned code {http_err.code}; evaluated using on-device computer vision engine.")
        return fallback
    except Exception as e:
        logger.warning(f"Gemini Vision request failed: {e}. Falling back to heuristic.")
        fallback = analyze_with_heuristic_cv(image_bytes, filename)
        fallback["warnings"].append("Evaluated using on-device computer vision engine (cloud service offline).")
        return fallback
