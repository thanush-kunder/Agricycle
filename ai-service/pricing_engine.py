"""
AgriCycle - Intelligent Price Estimation Engine
Calculates indicative agricultural waste market valuation based on category reference tables,
quality grades, quantity scale, and regional market demand.
"""

from typing import Dict, Any, Optional
from datetime import datetime, timezone

# Administrator-manageable reference price catalog (INR ₹ per kg)
DEFAULT_REFERENCE_PRICES: Dict[str, Dict[str, float]] = {
    "Rice Straw": {"A": 2.50, "B": 1.80, "C": 1.00},
    "Wheat Straw": {"A": 3.00, "B": 2.20, "C": 1.20},
    "Sugarcane Bagasse": {"A": 2.80, "B": 2.00, "C": 1.20},
    "Coconut Husk": {"A": 1.80, "B": 1.20, "C": 0.60},
    "Groundnut Shells": {"A": 3.20, "B": 2.20, "C": 1.20},
    "Corn Stalks": {"A": 2.00, "B": 1.40, "C": 0.80},
    "Banana Waste": {"A": 2.20, "B": 1.50, "C": 0.80},
    "Areca Leaf": {"A": 3.50, "B": 2.50, "C": 1.20},
    "Cotton Stalk": {"A": 1.80, "B": 1.20, "C": 0.70},
    "Other Agricultural Residues": {"A": 2.00, "B": 1.20, "C": 0.60},
}

# In-memory working copy that administrators can update
CURRENT_REFERENCE_PRICES = {k: dict(v) for k, v in DEFAULT_REFERENCE_PRICES.items()}
LAST_PRICING_UPDATE = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def update_reference_price(category: str, grade: str, price: float) -> bool:
    """Administrator interface to update reference pricing for a category and grade."""
    global LAST_PRICING_UPDATE
    if category in CURRENT_REFERENCE_PRICES and grade in ("A", "B", "C"):
        CURRENT_REFERENCE_PRICES[category][grade] = round(max(0.1, float(price)), 2)
        LAST_PRICING_UPDATE = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        return True
    return False


def get_all_reference_prices() -> Dict[str, Any]:
    """Returns the full reference pricing table with metadata."""
    return {
        "success": True,
        "currency": "INR (₹)",
        "unit": "per kg",
        "last_updated": LAST_PRICING_UPDATE,
        "catalog": CURRENT_REFERENCE_PRICES,
    }


def estimate_waste_valuation(
    waste_type: str,
    grade_code: str,
    quantity_kg: float,
    location: Optional[str] = None,
    quality_score: Optional[int] = None,
) -> Dict[str, Any]:
    """
    Computes market valuation for an agricultural residue batch:
    - Base price from administrator reference table
    - Quality score fine-tuning adjustment
    - Bulk volume transport efficiency bonus
    - Total estimated valuation: price_per_kg * quantity_kg
    """
    cat_prices = CURRENT_REFERENCE_PRICES.get(
        waste_type, CURRENT_REFERENCE_PRICES["Other Agricultural Residues"]
    )
    base_price = cat_prices.get(grade_code.upper(), cat_prices.get("B", 1.50))

    # Quality score multiplier: slight fine-tuning (+/- 5%) based on 0-100 score
    score_adj = 0.0
    if quality_score is not None:
        if quality_score >= 90:
            score_adj = 0.05 * base_price
        elif quality_score < 60:
            score_adj = -0.05 * base_price

    # Bulk volume logistics factor: large batches (>2,000 kg) optimize truck freight
    volume_bonus = 0.0
    qty = max(1.0, float(quantity_kg))
    if qty >= 5000:
        volume_bonus = 0.08 * base_price  # +8% for industrial bulk volume
    elif qty >= 2000:
        volume_bonus = 0.04 * base_price  # +4% for full-truckload (FTL)

    estimated_price_per_kg = round(max(0.20, base_price + score_adj + volume_bonus), 2)
    estimated_total_value = round(estimated_price_per_kg * qty, 2)

    reliability = "High (Regional Benchmark)" if waste_type in ("Rice Straw", "Coconut Husk", "Sugarcane Bagasse", "Areca Leaf") else "Moderate (Indicative Reference)"

    pricing_basis = (
        f"Base {waste_type} Grade {grade_code} benchmark: ₹{base_price:.2f}/kg"
    )
    if volume_bonus > 0:
        pricing_basis += f", with +₹{volume_bonus:.2f}/kg bulk volume bonus ({int(qty)} kg)"
    if score_adj != 0:
        pricing_basis += f", score adjustment of {'+' if score_adj > 0 else ''}₹{score_adj:.2f}/kg"

    return {
        "estimated_price_per_kg": estimated_price_per_kg,
        "quantity_kg": qty,
        "estimated_total_value": estimated_total_value,
        "currency": "INR (₹)",
        "pricing_basis": pricing_basis,
        "price_reliability_indicator": reliability,
        "last_updated": LAST_PRICING_UPDATE,
        "formula": "Estimated Total Value = Estimated Price Per KG × Quantity",
        "disclaimer": "Prices are indicative regional estimates for bio-economy trading and depend on final buyer-seller haulage terms.",
    }
