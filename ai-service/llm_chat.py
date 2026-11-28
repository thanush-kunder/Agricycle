"""
AgriCycle - Upgraded Conversational LLM Orchestrator
Provides genuine open-ended natural language conversation using Google Gemini or OpenAI API,
with conversation context management, multi-turn dialogue, coding assistance, and streaming SSE.
"""

import os
import json
import logging
import urllib.request
import urllib.error
from typing import List, Dict, Any, Generator, Optional

logger = logging.getLogger("agricycle-ai")

# Candidate models in priority order for resilience
GEMINI_CANDIDATE_MODELS = [
    os.getenv("GEMINI_MODEL", "gemini-3-flash-preview"),
    "gemini-3-flash-preview",
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.1-flash-lite"
]

# Master System Instruction for full open-ended conversational AI
AGRIBOT_SYSTEM_PROMPT = """You are AgriBot, an intelligent, empathetic, and highly capable AI assistant built into AgriCycle.

### 1. DUAL IDENTITY & CORE PURPOSE
- You possess two complementary identities:
  1. A General-Purpose Conversational AI (like ChatGPT): Capable of answering open-ended questions across science, technology, mathematics, programming/coding in any language, education, business, writing, creative drafting, and everyday reasoning. You NEVER refuse safe general questions or claim you can only talk about agriculture.
  2. A Specialized Agricultural Residue & Circular Bio-Economy Expert: Possessing deep scientific, industrial, and practical knowledge of crop waste management, recycling, composting, biochar, and AgriCycle platform operations.

### 2. SPECIALIZED AGRICULTURAL DOMAIN KNOWLEDGE
When discussing agricultural residues, provide practical, scientifically sound, and structured guidance:
- **Paddy Straw / Rice Straw**: High silica/lignin content, low digestibility for cattle if untreated. Primary uses: mushroom substrate (oyster and paddy straw mushrooms), baled boiler fuel/biomass pellets, cardboard/paper pulp, compost with cow dung/nitrogen supplement, biochar (pyrolysis). Highlight zero-burning alternatives to combat air pollution (smog, PM2.5).
- **Rice Husk**: 20% silica, high calorific value (~3000-3500 kcal/kg). Uses: industrial boiler fuel, rice husk ash (RHA) for green cement and refractory bricks, gasification, biochar soil amendment, bedding for poultry.
- **Sugarcane Bagasse**: High cellulose content (~45-50%). Uses: cogeneration power plants, pulp and paper, biodegradable tableware/molded packaging, bio-ethanol, furfural extraction, composting.
- **Coconut Husk & Coir**: Coconut mesocarp. Uses: coir fibre extraction (ropes, geotextiles, mattresses), coir pith / coco-peat (growing media, hydroponics, soil moisture retention), mulching for orchards.
- **Groundnut Shells**: Uses: biomass briquettes/pellets, activated carbon production, particleboard filler, composting.
- **Wheat Straw**: Cattle fodder (chaffed), mushroom substrate, bio-energy, paper pulp.
- **Banana Waste**: Pseudostem fiber (eco-textiles, handicrafts, paper), sap/foliar spray (liquid organic fertilizer), vermicompost.
- **Corn Stalks & Cobs**: Biofuel pellets, furfural, activated carbon, abrasive grits, compost.
- **Composting & Vermicomposting**: C:N ratio balancing (ideal 25:1 to 30:1), moisture control (50-60%), aeration, microbial inoculants, Eisenia fetida earthworms for vermicompost.

### 3. WASTE RECOMMENDATION ENGINE PROTOCOL
When a user asks what to do with a specific residue (e.g., "I have 500 kg of rice husk" or "2 tons of coconut husk"):
Structure your answer clearly:
1. **Material Profile**: Key characteristics (moisture, bulk density, calorific value, fiber).
2. **High-Value Industrial Opportunities**: Suitable off-takers (power plants, paper mills, briquette makers).
3. **On-Farm / Circular Applications**: Composting, mulching, mushroom cultivation, or soil amendment.
4. **Processing & Storage Requirements**: Necessary baling, shredding, sun-drying, or moisture thresholds (e.g. <15% for fuel to prevent mold/spontaneous heating).
5. **AgriCycle Action Step**: Guide them on how to list it on AgriCycle to connect with verified buyers nearby.

### 4. AGRICYCLE PLATFORM KNOWLEDGE
You are an expert guide to the AgriCycle platform:
- **Platform Mission**: Connect agricultural waste generators (farmers, agro-processors) with utilizers (industries, bio-energy plants, composters) to eliminate crop burning and monetize residue.
- **User Roles**:
  • Generator (Farmer / Producer): Lists crop waste, uploads photos, specifies quantity and location, receives exchange requests.
  • Utilizer (Industry / Buyer / Composter): Browses waste by type and location, requests exchanges, tracks circular economy impact.
  • Aggregator / Logistics: Handles bulk collection and transport.
- **Core Platform Features**:
  • Waste Listing (`list-waste.html` / `POST /api/listings`): Specify title, waste category, quantity in kg, price per kg (or Free giveaway), moisture %, quality grade, and location.
  • AI Quality & Price Verification (`POST /api/ai/verify`, `GET /api/waste-analysis/pricing/catalog`): Automatically grades waste (Grade A/B/C) and compares against fair market reference prices.
  • Proximity Matching (`GET /api/match/recommendations`): Uses the Haversine distance algorithm to rank nearby listings and reduce transport emissions.
  • Exchange Lifecycle (`requests.html` / `POST /api/exchanges`): Pending -> Accepted / Negotiating -> Confirmed -> Completed.
  • Environmental Impact Calculator (`impact.html`): Quantifies CO2 emissions prevented from avoided burning and landfill diversion.
- **Honesty Rule**: If a user asks for a feature that does not exist or asks you for real buyer phone numbers, be completely honest: explain the actual AgriCycle workflow and never fabricate private contact details or fictitious listings.

### 5. MULTILINGUAL COMPETENCE
- Fully support **English**, **Kannada (ಕನ್ನಡ)**, and **Hindi (हिंदी)**.
- Automatically detect the user's language and respond in the same language by default.
- If a user asks in Kannada (e.g., "ನನ್ನ ಬಳಿ 500 ಕೆಜಿ ಭತ್ತದ ಹುಲ್ಲು ಇದೆ"), reply in clear, grammatically sound Kannada while keeping agricultural terms accurate.
- If a user asks in Hindi (e.g., "धान के पुआल का क्या उपयोग हो सकता है?"), reply in fluent Hindi.
- Gracefully understand mixed language / transliteration (Kanglish, Hinglish).
- If the user explicitly asks to switch languages (e.g., "Reply in Kannada" or "Explain in Hindi"), switch immediately.

### 6. COMMUNICATION & MARKDOWN STYLE
1. Be warm, supportive, and articulate.
2. Adapt length: direct and concise for simple queries; structured and thorough for complex advisory.
3. Use GitHub-flavored Markdown:
   - Clear headings (`##`, `###`) for sectioning.
   - Bullet points and numbered steps.
   - Markdown tables for comparisons.
   - Fenced code blocks with language identifiers (e.g., ```python, ```javascript) and helpful comments when programming.
4. Clearly distinguish between established facts, potential applications, and practices needing local agronomic verification.
"""

def get_system_prompt() -> str:
    """Returns the master system prompt."""
    return AGRIBOT_SYSTEM_PROMPT.strip()


def build_gemini_contents(message: str, history: List[Dict[str, str]]) -> List[Dict[str, Any]]:
    """
    Builds the Gemini multi-turn contents array with proper role mapping.
    """
    contents = []
    recent_history = history[-12:] if history else []
    for turn in recent_history:
        role = turn.get("role", "user")
        content = turn.get("content", "").strip()
        if not content:
            continue
        gemini_role = "model" if role in ("assistant", "model", "bot") else "user"
        contents.append({
            "role": gemini_role,
            "parts": [{"text": content}]
        })

    contents.append({
        "role": "user",
        "parts": [{"text": message.strip()}]
    })
    return contents


def call_gemini_api(
    message: str,
    history: List[Dict[str, str]],
    api_key: str,
    model_name: Optional[str] = None
) -> Dict[str, Any]:
    """
    Calls Google Gemini GenerateContent REST API with multi-turn conversation context.
    Tries candidate models in succession if one model is overloaded or unavailable.
    """
    clean_key = api_key.strip()
    candidates = [model_name] if model_name else GEMINI_CANDIDATE_MODELS
    last_err = None

    for model in candidates:
        if not model:
            continue
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={clean_key}"
        contents = build_gemini_contents(message, history)

        payload = {
            "system_instruction": {
                "parts": [{"text": get_system_prompt()}]
            },
            "contents": contents,
            "generationConfig": {
                "temperature": 0.7,
                "topP": 0.95,
                "maxOutputTokens": 2048,
            }
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        for attempt in range(1, 4):
            try:
                with urllib.request.urlopen(req, timeout=25) as response:
                    res_body = response.read().decode("utf-8")
                    data = json.loads(res_body)

                candidates_data = data.get("candidates", [])
                if candidates_data:
                    parts = candidates_data[0].get("content", {}).get("parts", [])
                    if parts:
                        reply_text = parts[0].get("text", "").strip()
                        if reply_text:
                            return {
                                "reply": reply_text,
                                "model_used": model
                            }
            except urllib.error.HTTPError as http_err:
                err_msg = http_err.read().decode("utf-8", errors="ignore")
                logger.warning(f"Gemini API model {model} attempt {attempt} HTTP Error {http_err.code}: {err_msg[:150]}")
                last_err = f"HTTP {http_err.code}: {err_msg[:120]}"
                if http_err.code in (429, 503) and attempt < 3:
                    import time
                    time.sleep(1.2 * attempt)
                    continue
                break
            except Exception as e:
                logger.warning(f"Gemini API model {model} attempt {attempt} failed: {e}")
                last_err = str(e)
                if attempt < 3:
                    import time
                    time.sleep(1.0)
                    continue
                break

    raise RuntimeError(f"All Gemini models failed. Last error: {last_err}")


def stream_gemini_api(
    message: str,
    history: List[Dict[str, str]],
    api_key: str,
    model_name: Optional[str] = None
) -> Generator[str, None, None]:
    """
    Streams response chunks from Google Gemini API using SSE streamGenerateContent.
    """
    clean_key = api_key.strip()
    candidates = [model_name] if model_name else GEMINI_CANDIDATE_MODELS
    contents = build_gemini_contents(message, history)

    streamed_anything = False
    for model in candidates:
        if not model:
            continue
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:streamGenerateContent?key={clean_key}&alt=sse"

        payload = {
            "system_instruction": {
                "parts": [{"text": get_system_prompt()}]
            },
            "contents": contents,
            "generationConfig": {
                "temperature": 0.7,
                "topP": 0.95,
                "maxOutputTokens": 2048,
            }
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        for attempt in range(1, 3):
            try:
                with urllib.request.urlopen(req, timeout=30) as response:
                    for line in response:
                        decoded = line.decode("utf-8", errors="ignore").strip()
                        if decoded.startswith("data: "):
                            json_str = decoded[6:].strip()
                            if json_str:
                                try:
                                    data = json.loads(json_str)
                                    candidates_data = data.get("candidates", [])
                                    if candidates_data:
                                        parts = candidates_data[0].get("content", {}).get("parts", [])
                                        for part in parts:
                                            chunk_text = part.get("text", "")
                                            if chunk_text:
                                                streamed_anything = True
                                                yield chunk_text
                                except json.JSONDecodeError:
                                    pass
                if streamed_anything:
                    return
            except Exception as e:
                logger.warning(f"Gemini streaming model {model} attempt {attempt} failed: {e}")
                if streamed_anything:
                    return
                if attempt < 2:
                    import time
                    time.sleep(1.2)
                    continue
                break

    if not streamed_anything:
        raise RuntimeError("Gemini SSE streaming did not yield any chunks.")


def call_openai_api(
    message: str,
    history: List[Dict[str, str]],
    api_key: str,
    model_name: Optional[str] = None
) -> str:
    """
    Calls OpenAI Chat Completions API with multi-turn conversation context.
    """
    model = model_name or os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    url = "https://api.openai.com/v1/chat/completions"

    messages = [{"role": "system", "content": get_system_prompt()}]
    recent_history = history[-12:] if history else []
    for turn in recent_history:
        role = turn.get("role", "user")
        content = turn.get("content", "").strip()
        if not content:
            continue
        openai_role = "assistant" if role in ("assistant", "model", "bot") else "user"
        messages.append({"role": openai_role, "content": content})

    messages.append({"role": "user", "content": message.strip()})

    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 2048
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key.strip()}"
        },
        method="POST"
    )

    with urllib.request.urlopen(req, timeout=25) as response:
        res_body = response.read().decode("utf-8")
        data = json.loads(res_body)

    choices = data.get("choices", [])
    if choices:
        return choices[0].get("message", {}).get("content", "").strip()

    raise ValueError("No response generated by OpenAI model.")


def chat_orchestrator(
    message: str,
    history: Optional[List[Dict[str, str]]] = None,
    user_role: str = "generator",
    crop_context: Optional[str] = None
) -> Dict[str, Any]:
    """
    Core open-ended chat orchestrator.
    Dispatches every query directly to the real AI language model API.
    """
    clean_history = history or []
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    openai_key = os.getenv("OPENAI_API_KEY", "").strip()

    # Priority 1: Google Gemini API
    if gemini_key and gemini_key not in ("your_gemini_api_key", "your_api_key", ""):
        try:
            logger.info("Routing query to live Google Gemini API...")
            gemini_res = call_gemini_api(message, clean_history, gemini_key)
            return {
                "success": True,
                "reply": gemini_res["reply"],
                "model_used": gemini_res["model_used"],
                "provider": "Google Gemini",
                "suggestions": [
                    "Can you explain that in simpler terms?",
                    "Give me a practical code example",
                    "What are the next steps?"
                ]
            }
        except Exception as e:
            logger.warning(f"Google Gemini API call failed: {e}. Attempting secondary provider.")

    # Priority 2: OpenAI API
    if openai_key and openai_key not in ("your_openai_api_key", "your_api_key", ""):
        try:
            logger.info("Routing query to live OpenAI API...")
            reply = call_openai_api(message, clean_history, openai_key)
            return {
                "success": True,
                "reply": reply,
                "model_used": os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
                "provider": "OpenAI",
                "suggestions": [
                    "Can you expand on that?",
                    "Give me step-by-step instructions",
                    "How does this apply to my project?"
                ]
            }
        except Exception as e:
            logger.warning(f"OpenAI API call failed: {e}.")

    # Honest error handling if AI services are unavailable
    logger.error("AI service is currently unavailable or API keys are unconfigured.")
    return {
        "success": False,
        "error": "ai_service_unavailable",
        "reply": "⚠️ **AI Service Notice**: The AI language model service is temporarily unavailable. Please verify your internet connection or click **🔄 Regenerate** to retry.",
        "model_used": "none",
        "provider": "None",
        "suggestions": [
            "What is artificial intelligence?",
            "Can you explain quantum computing like I'm 10?",
            "Write a Python program to sort a list"
        ]
    }


def stream_chat_orchestrator(
    message: str,
    history: Optional[List[Dict[str, str]]] = None,
    user_role: str = "generator",
    crop_context: Optional[str] = None
) -> Generator[str, None, None]:
    """
    Yields progressive text chunks for Server-Sent Events (SSE) streaming directly from the AI model.
    """
    clean_history = history or []
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()

    if gemini_key and gemini_key not in ("your_gemini_api_key", "your_api_key", ""):
        try:
            logger.info("Streaming query from live Google Gemini API...")
            for chunk in stream_gemini_api(message, clean_history, gemini_key):
                yield chunk
            return
        except Exception as e:
            logger.warning(f"Gemini streaming failed: {e}. Falling back to standard synchronous model generation.")

    # Fallback to standard synchronous generation
    result = chat_orchestrator(message, clean_history, user_role, crop_context)
    full_text = result["reply"]

    import time
    words = full_text.split(" ")
    chunk_size = 4
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size]) + " "
        yield chunk
        time.sleep(0.015)
