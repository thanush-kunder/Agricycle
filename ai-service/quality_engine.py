"""
AgriCycle - Python-Based Quality Assessment Engine
Evaluates agricultural waste quality deterministically using category-specific criteria,
visual observations, farmer physical measurements, and storage conditions.
"""

from typing import Dict, Any, Optional

RULES_VERSION = "1.0.0-provisional"

# Configurable category-specific moisture and quality parameters
CATEGORY_QUALITY_CRITERIA = {
    "Rice Straw": {
        "moisture_optimal_max": 15.0,
        "moisture_acceptable_max": 22.0,
        "moisture_critical_min": 22.1,
        "primary_metric": "Moisture content & fiber golden cleanliness",
        "standard_notes": "Moisture <15% ensures zero mould during baling and enables high biological yield for mushroom spawn.",
    },
    "Wheat Straw": {
        "moisture_optimal_max": 14.0,
        "moisture_acceptable_max": 20.0,
        "moisture_critical_min": 20.1,
        "primary_metric": "Dry matter content & golden stalk integrity",
        "standard_notes": "Dry wheat straw (<14% moisture) is ideal for animal fodder digestibility and paper pulp manufacturing.",
    },
    "Sugarcane Bagasse": {
        "moisture_optimal_max": 20.0,
        "moisture_acceptable_max": 35.0,
        "moisture_critical_min": 35.1,
        "primary_metric": "Residual sucrose dryness & pith fiber ratio",
        "standard_notes": "Dry bagasse (<20% moisture) has high calorific value (~3,800 kcal/kg) and is mold-resistant for tableware molding.",
    },
    "Coconut Husk": {
        "moisture_optimal_max": 18.0,
        "moisture_acceptable_max": 28.0,
        "moisture_critical_min": 28.1,
        "primary_metric": "Lignin fiber strength & salt wash status",
        "standard_notes": "Coir fibers require moderate dryness (<18%) for decortication without tensile fiber snapping.",
    },
    "Groundnut Shells": {
        "moisture_optimal_max": 12.0,
        "moisture_acceptable_max": 18.0,
        "moisture_critical_min": 18.1,
        "primary_metric": "Shell brittleness & aflatoxin/mold absence",
        "standard_notes": "Must be kept strictly dry (<12% moisture) to prevent Aspergillus fungus formation.",
    },
    "Corn Stalks": {
        "moisture_optimal_max": 16.0,
        "moisture_acceptable_max": 25.0,
        "moisture_critical_min": 25.1,
        "primary_metric": "Stalk pith dryness & soil contamination",
        "standard_notes": "Optimal moisture <16% allows immediate hammer-mill shredding for bio-power boilers.",
    },
    "Banana Waste": {
        "moisture_optimal_max": 25.0,
        "moisture_acceptable_max": 45.0,
        "moisture_critical_min": 45.1,
        "primary_metric": "Pseudostem fiber extraction stage & drying",
        "standard_notes": "Fresh stems are naturally watery; dried fiber requires <25% moisture for textile yarn spinning.",
    },
    "Areca Leaf": {
        "moisture_optimal_max": 12.0,
        "moisture_acceptable_max": 18.0,
        "moisture_critical_min": 18.1,
        "primary_metric": "Sheath flat uniformity & zero fungal spotting",
        "standard_notes": "Leaves with <12% moisture and clean surface press smoothly into Grade A dinnerware without steam blistering.",
    },
    "Cotton Stalk": {
        "moisture_optimal_max": 15.0,
        "moisture_acceptable_max": 24.0,
        "moisture_critical_min": 24.1,
        "primary_metric": "Woody stem density & soil root removal",
        "standard_notes": "Moisture <15% ensures smooth chipper processing for particle board and biochar retorts.",
    },
    "Other Agricultural Residues": {
        "moisture_optimal_max": 15.0,
        "moisture_acceptable_max": 22.0,
        "moisture_critical_min": 22.1,
        "primary_metric": "Surface dryness & impurity clearance",
        "standard_notes": "General agricultural biomass standard: dry, covered storage ensures highest valorization value.",
    },
}


def calculate_quality_assessment(
    waste_type: str,
    visual_observations: Dict[str, Any],
    farmer_details: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Executes deterministic quality grading and 100-point scoring.
    Combines:
    - Visual Observations (from AI Vision inspection)
    - Physical measurements & storage conditions (from farmer form)
    - Category-specific criteria
    """
    criteria = CATEGORY_QUALITY_CRITERIA.get(waste_type, CATEGORY_QUALITY_CRITERIA["Other Agricultural Residues"])

    # Extract visual inputs
    condition_str = (visual_observations.get("visible_condition") or "Good").lower()
    damage_str = (visual_observations.get("visible_damage") or "Low").lower()
    contamination_str = (visual_observations.get("visible_contamination") or "Low").lower()
    fungal_str = (visual_observations.get("fungal_growth") or "Not visibly detected").lower()

    # Extract farmer inputs
    moisture_val = farmer_details.get("moisture_percentage")
    storage_condition = (farmer_details.get("storage_condition") or "Covered storage").strip()
    is_dried = farmer_details.get("is_dried", False)

    # -------------------------------------------------------------
    # 1. Visual Condition Score (max 30 points)
    # -------------------------------------------------------------
    if "good" in condition_str:
        score_visual = 30
        visual_reason = "Good visible appearance, vibrant natural colour tone"
    elif "fair" in condition_str:
        score_visual = 20
        visual_reason = "Moderate visible weathering or slight color fading"
    else:
        score_visual = 10
        visual_reason = "Noticeable surface deterioration or discoloration"

    # -------------------------------------------------------------
    # 2. Damage Assessment Score (max 25 points)
    # -------------------------------------------------------------
    if "low" in damage_str or "none" in damage_str:
        score_damage = 25
        damage_reason = "Minimal or low visible mechanical breakage"
    elif "mod" in damage_str or "med" in damage_str:
        score_damage = 17
        damage_reason = "Moderate fragmentation or stalk breakage"
    else:
        score_damage = 8
        damage_reason = "Severe shattering, crushing, or particulate degradation"

    # -------------------------------------------------------------
    # 3. Contamination Assessment Score (max 25 points)
    # -------------------------------------------------------------
    has_fungus = "mould" in fungal_str or "fung" in fungal_str or "spotted" in fungal_str
    if "low" in contamination_str and not has_fungus:
        score_contamination = 25
        contamination_reason = "Clean material with minimal soil/dust adherence"
    elif "mod" in contamination_str or "dust" in contamination_str:
        score_contamination = 15
        contamination_reason = "Moderate surface soil, dust, or minor weed mixture"
    else:
        score_contamination = 6
        contamination_reason = "Heavy foreign debris, stones, or visible microbial spots"

    if has_fungus:
        score_contamination = min(score_contamination, 8)
        contamination_reason += " (Visible mould/fungal spots detected)"

    # -------------------------------------------------------------
    # 4. Moisture & Storage Condition (max 20 points)
    # -------------------------------------------------------------
    moisture_known = moisture_val is not None and isinstance(moisture_val, (int, float)) and moisture_val > 0
    score_moisture = 0
    moisture_status = "Unknown / Not Provided"

    if moisture_known:
        m = float(moisture_val)
        if m <= criteria["moisture_optimal_max"]:
            score_moisture = 20
            moisture_status = f"{m}% (Optimal - within {criteria['moisture_optimal_max']}% threshold)"
            moisture_reason = f"Excellent dry-matter content below {criteria['moisture_optimal_max']}% threshold"
        elif m <= criteria["moisture_acceptable_max"]:
            score_moisture = 13
            moisture_status = f"{m}% (Acceptable - moderate moisture)"
            moisture_reason = f"Within commercial trade tolerance ({criteria['moisture_acceptable_max']}%), slight drying recommended before sealed storage"
        else:
            score_moisture = 5
            moisture_status = f"{m}% (Critical - high moisture)"
            moisture_reason = f"Exceeds safe storage threshold ({criteria['moisture_critical_min']}%), risk of spontaneous heating and mould"
    else:
        # If moisture is unknown, score based on storage condition + drying status as proxy
        storage_lower = storage_condition.lower()
        if "indoor" in storage_lower or "covered" in storage_lower:
            score_moisture = 14 if is_dried else 12
            moisture_reason = f"Moisture not measured. Evaluated based on protective {storage_condition}"
        elif "open" in storage_lower:
            score_moisture = 6
            moisture_reason = "Moisture not measured. Open-air field exposure increases dampness risk"
        else:
            score_moisture = 10
            moisture_reason = f"Moisture not measured. Standard baseline applied for {storage_condition}"

    # -------------------------------------------------------------
    # Storage Penalty / Adjustment
    # -------------------------------------------------------------
    storage_penalty = 0
    if "open" in storage_condition.lower():
        storage_penalty = 6  # Open storage degrades quality over time

    # Calculate total quality score out of 100
    raw_score = score_visual + score_damage + score_contamination + score_moisture - storage_penalty
    quality_score = max(10, min(100, raw_score))

    # Calculate Assessment Completeness Percentage
    # 4 components: Visual (30%), Damage (25%), Contamination (25%), Moisture Measurement (20%)
    completeness = 80 if not moisture_known else 100
    if not farmer_details.get("harvest_date"):
        completeness -= 10
    if not farmer_details.get("storage_condition"):
        completeness -= 5
    completeness = max(50, min(100, completeness))

    # -------------------------------------------------------------
    # Final Quality Grade Determination
    # -------------------------------------------------------------
    # Grade A: Score >= 80, no visible fungus, no critical moisture
    # Grade B: Score 60 - 79
    # Grade C: Score < 60 or critical contamination/mould
    if has_fungus or (moisture_known and float(moisture_val) > criteria["moisture_critical_min"]):
        final_grade = "Grade C (Low Quality)"
        grade_code = "C"
        grade_desc = "Significant quality limitations due to moisture or microbial spots."
    elif quality_score >= 80:
        final_grade = "Grade A (High Quality)"
        grade_code = "A"
        grade_desc = "Premium condition with optimal physical parameters and clean appearance."
    elif quality_score >= 60:
        final_grade = "Grade B (Medium Quality)"
        grade_code = "B"
        grade_desc = "Good commercial grade suitable for biomass conversion and standard applications."
    else:
        final_grade = "Grade C (Low Quality)"
        grade_code = "C"
        grade_desc = "High moisture or physical limitations; suited for controlled soil or boiler applications."

    return {
        "waste_type": waste_type,
        "final_grade": final_grade,
        "grade_code": grade_code,
        "quality_score": quality_score,
        "assessment_completeness": completeness,
        "score_breakdown": {
            "visual_condition": {
                "score": score_visual,
                "max": 30,
                "detail": visual_reason,
            },
            "damage_assessment": {
                "score": score_damage,
                "max": 25,
                "detail": damage_reason,
            },
            "contamination_assessment": {
                "score": score_contamination,
                "max": 25,
                "detail": contamination_reason,
            },
            "moisture_assessment": {
                "score": score_moisture,
                "max": 20,
                "detail": moisture_status,
                "explanation": moisture_reason,
                "measured_by_farmer": moisture_known,
            },
            "storage_adjustment": {
                "score": -storage_penalty,
                "condition": storage_condition,
            },
        },
        "grading_rules_version": RULES_VERSION,
        "category_criteria": {
            "primary_metric": criteria["primary_metric"],
            "optimal_moisture_max": criteria["moisture_optimal_max"],
            "guideline": criteria["standard_notes"],
        },
        "disclaimer": "Quality Grade and Score are derived from farmer-reported parameters and non-invasive surface visual analysis. Actual industrial specifications may require lab testing.",
    }
