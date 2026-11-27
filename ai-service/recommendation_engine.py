"""
AgriCycle - Agricultural Waste Recommendation Engine
Recommends high-value circular applications based on waste category,
quality grade, physical characteristics, and processing requirements.
"""

from typing import List, Dict, Any

RECOMMENDATION_DATABASE: Dict[str, Dict[str, List[Dict[str, Any]]]] = {
    "Rice Straw": {
        "A": [
            {
                "application": "Mushroom Cultivation Substrate",
                "suitability_explanation": "Grade A dry straw (<15% moisture) provides clean lignocellulose for high-yield Oyster (Pleurotus) and Paddy Straw (Volvariella) mushrooms.",
                "processing_requirements": "Chop into 3-5 cm pieces, soak in water for 12 hours, pasteurize with steam (65°C for 4 hrs) before spawning.",
                "warnings": "Ensure zero mould spots; contamination destroys mushroom mycelium.",
            },
            {
                "application": "High-Grade Animal Bedding & Dry Fodder",
                "suitability_explanation": "Clean golden straw has high absorbency, keeping livestock dry and comfortable while preventing hoof infections.",
                "processing_requirements": "Bale tightly and store off the ground on wooden pallets under cover.",
                "warnings": "Do not feed damp straw to ruminants to avoid digestive bloat.",
            },
            {
                "application": "Bio-Pellet & Briquette Fuel",
                "suitability_explanation": "High calorific density (~3,400 kcal/kg) when compacted into 8mm pellets, replacing industrial thermal coal.",
                "processing_requirements": "Hammer-mill grinding followed by hydraulic pellet pressing.",
                "warnings": "Requires moisture below 14% to prevent pellet steam expansion during extrusion.",
            },
        ],
        "B": [
            {
                "application": "Aerobic Microbial Composting",
                "suitability_explanation": "Excellent carbon-to-nitrogen ratio (C:N ~ 80:1) as carbon brown matter when layered with cattle manure.",
                "processing_requirements": "Layer with green matter (1:3 ratio), maintain 50% pile moisture, turn pile weekly for 45 days.",
                "warnings": "Aerate regularly to prevent anaerobic foul odors and methane release.",
            },
            {
                "application": "Eco-Friendly Cardboard & Pulp Packaging",
                "suitability_explanation": "Moderate fiber length suitable for kraft paper and molded egg tray packaging mills.",
                "processing_requirements": "Mechanical pulping and thermoforming by regional paper converters.",
                "warnings": "Remove foreign plastic and stones prior to delivery.",
            },
            {
                "application": "Industrial Biomass Briquetting",
                "suitability_explanation": "Acceptable for industrial boiler blend in sugar, textile, and cement plants.",
                "processing_requirements": "Sun-dry to <16% moisture before feed into briquette press.",
                "warnings": "High silica content requires ash removal from boilers.",
            },
        ],
        "C": [
            {
                "application": "Controlled Thermal Boiler Feedstock",
                "suitability_explanation": "Suited for large fluid-bed combustors with automated ash handling.",
                "processing_requirements": "Pre-drying and blending with high-calorific bagasse or woodchips.",
                "warnings": "Not suitable for mushroom cultivation or animal feed.",
            },
            {
                "application": "Biochar / Pyrolysis Soil Amendment",
                "suitability_explanation": "Low-oxygen pyrolysis converts weathered residue into high-carbon biochar for long-term soil moisture retention.",
                "processing_requirements": "Pyrolysis kiln at 450°C-550°C.",
                "warnings": "Cool biochar completely before storage to avoid spontaneous combustion.",
            },
        ],
    },
    "Wheat Straw": {
        "A": [
            {
                "application": "Premium Livestock Fodder & TMR Blends",
                "suitability_explanation": "High digestibility and fiber content make clean wheat straw a vital component in Total Mixed Ration (TMR) for dairy cattle.",
                "processing_requirements": "Chop finely (2-4 cm) and treat with 2% urea-ammoniation to boost protein equivalent.",
                "warnings": "Ensure zero dust or sand contamination before feeding.",
            },
            {
                "application": "White Button Mushroom Compost",
                "suitability_explanation": "The global industry benchmark substrate for Agaricus bisporus button mushroom composting.",
                "processing_requirements": "Synthetic composting with poultry manure, gypsum, and urea over 14-21 days.",
                "warnings": "Requires strict moisture monitoring during pile conditioning.",
            },
        ],
        "B": [
            {
                "application": "Paper & Pulp Manufacturing",
                "suitability_explanation": "Non-wood fiber with high alpha-cellulose yields strong printing and packaging paper.",
                "processing_requirements": "Alkaline chemical digestion and chlorine-free bleaching.",
                "warnings": "Transport in dense bales to optimize freight economics.",
            },
            {
                "application": "Agricultural Soil Mulching",
                "suitability_explanation": "Suppresses weeds, conserves soil water by up to 35%, and moderates root temperatures in horticulture.",
                "processing_requirements": "Spread uniformly 5-8 cm thick across crop beds.",
                "warnings": "Keep 5 cm clear of main tree trunks to avoid collar rot.",
            },
        ],
        "C": [
            {
                "application": "Biomass Pellet Boilers",
                "suitability_explanation": "Energy conversion in district heating and industrial thermal plants.",
                "processing_requirements": "Shredding and blending with woody biomass.",
                "warnings": "Avoid feeding to livestock.",
            },
        ],
    },
    "Coconut Husk": {
        "A": [
            {
                "application": "Coir Geotextile & Erosion Control Netting",
                "suitability_explanation": "Grade A long fibers have high tensile strength (up to 175 MPa) and endure 3-5 years outdoors against soil erosion.",
                "processing_requirements": "De-fibering in decorticator, carding, and spinning into 2-ply coir yarn.",
                "warnings": "Keep husks free of rocks to protect decorticator drum teeth.",
            },
            {
                "application": "Low-EC Export Coco Peat Blocks",
                "suitability_explanation": "Pith has 800% water-holding capacity, ideal for precision hydroponics and greenhouse substrates.",
                "processing_requirements": "De-fibered pith washed with fresh water to EC < 0.5 mS/cm, sun-dried, compressed into 5kg blocks.",
                "warnings": "Ensure desalination testing (EC & pH check) before nursery sale.",
            },
        ],
        "B": [
            {
                "application": "Standard Horticultural Coco Peat",
                "suitability_explanation": "Reliable organic potting soil conditioner for urban landscaping and terrace gardens.",
                "processing_requirements": "Sieve to remove stone particles; hydrate before potting mix blending.",
                "warnings": "Buffer with calcium nitrate if high potassium exchange is observed.",
            },
            {
                "application": "Traditional Coir Rope & Mat Weaving",
                "suitability_explanation": "Durable fiber suitable for floor mats, doormats, and agriculture trellis ties.",
                "processing_requirements": "Spinning and handloom / mechanized weaving.",
                "warnings": "Store finished ropes in dry ventilated warehouses.",
            },
        ],
        "C": [
            {
                "application": "Activated Carbon & Biofuel Char",
                "suitability_explanation": "Coconut shells and dense husks yield high-micropore activated carbon for water and air filters.",
                "processing_requirements": "Carbonization in charcoal pit followed by steam activation at 900°C.",
                "warnings": "Operate kilns with emission control scrubbers.",
            },
        ],
    },
    "Sugarcane Bagasse": {
        "A": [
            {
                "application": "Thermoformed Biodegradable Tableware",
                "suitability_explanation": "Grade A dry bagasse fibers press into food-contact safe, microwaveable, compostable plates and food containers.",
                "processing_requirements": "De-pithing, bleaching with hydrogen peroxide, and high-pressure hot molding (160°C).",
                "warnings": "Must be free from sour fermentation or mould odor.",
            },
            {
                "application": "Bleached Kraft & Writing Paper",
                "suitability_explanation": "Excellent non-wood paper feedstock with high opacity and smoothness.",
                "processing_requirements": "Chemical cooking (soda-anthraquinone process) at regional paper mills.",
                "warnings": "Maintain moisture <20% for storage beyond 30 days.",
            },
        ],
        "B": [
            {
                "application": "Cogeneration Boiler Biomass Fuel",
                "suitability_explanation": "Standard boiler fuel in sugar mills generating steam and green grid electricity.",
                "processing_requirements": "Direct feed or pneumatic spreader stoker combustion.",
                "warnings": "Every 1% reduction in moisture increases boiler thermal efficiency by ~0.5%.",
            },
            {
                "application": "Cellulosic 2G Bioethanol Feedstock",
                "suitability_explanation": "Hydrolyzable glucan content fermented into green ethanol for petrol blending.",
                "processing_requirements": "Acid/enzymatic pre-treatment and fermentation at commercial bio-refineries.",
                "warnings": "Requires steady bulk delivery logistics.",
            },
        ],
        "C": [
            {
                "application": "Industrial Composting & Boiler Blend",
                "suitability_explanation": "Useful as bulky organic bulking agent for press-mud distillery composting.",
                "processing_requirements": "Enrich with microbial consortia and distillery spent wash.",
                "warnings": "Watch for leachate runoff.",
            },
        ],
    },
    "Areca Leaf": {
        "A": [
            {
                "application": "Export-Grade Biodegradable Tableware Plates",
                "suitability_explanation": "Naturally shed dry sheaths press into elegant, leak-proof, zero-plastic plates and bowls with high export demand.",
                "processing_requirements": "Wash with soft brushes, soak for 15 mins in clean water, press at 150°C-180°C for 45 seconds, trim edges.",
                "warnings": "Only use leaves with zero fungal black spots and clean beige-green sheen.",
            },
            {
                "application": "Artisanal Eco-Packaging & Trays",
                "suitability_explanation": "Flexible when conditioned, yielding luxury sustainable packaging boxes for organic produce.",
                "processing_requirements": "Laser cutting or mechanical die-stamping.",
                "warnings": "Store flat under weights to prevent edge curling.",
            },
        ],
        "B": [
            {
                "application": "Domestic Catering & Street Food Bowls",
                "suitability_explanation": "Small or minor-blemished leaves suitable for local sweet stalls, temple prasad, and food trucks.",
                "processing_requirements": "Hydraulic heat press molding and UV sterilization.",
                "warnings": "Sort leaves by size before pressing.",
            },
            {
                "application": "Orchard Weed-Control Mulch",
                "suitability_explanation": "Heavy durable sheaths slow weed emergence in areca and coffee plantations for over 6 months.",
                "processing_requirements": "Lay directly between planting rows.",
                "warnings": "Avoid piling against seedlings.",
            },
        ],
        "C": [
            {
                "application": "Shredded Vermicompost Bedding",
                "suitability_explanation": "Rich in organic matter; shredded sheaths provide slow-release carbon for earthworm beds.",
                "processing_requirements": "Rotary knife shredding to <2 cm pieces before composting.",
                "warnings": "Pre-decompose with cow-dung slurry for 15 days.",
            },
        ],
    },
    "Groundnut Shells": {
        "A": [
            {
                "application": "High-Density Energy Briquettes",
                "suitability_explanation": "High natural oil and lignin content produce briquettes with ~4,200 kcal/kg calorific value without chemical binders.",
                "processing_requirements": "Screen to remove soil, screw-press briquetting at high pressure.",
                "warnings": "Ensure shells are strictly dry (<12% moisture).",
            },
            {
                "application": "Particle Board & Composite Filler",
                "suitability_explanation": "Uniform granular structure replaces wood particles in lightweight acoustic and furniture panels.",
                "processing_requirements": "Milling and resin blending.",
                "warnings": "Screen thoroughly to eliminate dust particulates.",
            },
        ],
        "B": [
            {
                "application": "Cattle Roughage Blend Feed",
                "suitability_explanation": "Provides required dietary roughage and rumination fiber when blended with molasses and protein meals.",
                "processing_requirements": "Fine grinding and blending with liquid molasses and mineral premix.",
                "warnings": "Test for aflatoxin B1 before feeding lactating livestock.",
            },
            {
                "application": "Poultry Litter Bedding",
                "suitability_explanation": "Good moisture absorption keeping broiler shed floors dry and sanitary.",
                "processing_requirements": "Spread 5-10 cm deep across disinfected poultry houses.",
                "warnings": "Must be free from sharp foreign nails or stones.",
            },
        ],
        "C": [
            {
                "application": "Biomass Boiler Fuel",
                "suitability_explanation": "Direct stoker boiler fuel for oil mills, dyeing units, and district heating.",
                "processing_requirements": "Direct mechanical auger feed.",
                "warnings": "High combustion rate requires draft control.",
            },
        ],
    },
    "Corn Stalks": {
        "A": [
            {
                "application": "Industrial Biomass Pellets",
                "suitability_explanation": "Optimal fiber and cellulose make corn stover ideal for automated co-firing in thermal power plants.",
                "processing_requirements": "Baling, tub-grinding, and rotary pelletizing.",
                "warnings": "Collect stalks without dragging through field soil to keep ash <8%.",
            },
            {
                "application": "High-Fiber Livestock Winter Forage",
                "suitability_explanation": "Chopped stover enriched with urea-molasses provides emergency maintenance ration for drought resilience.",
                "processing_requirements": "Ensilage with lactic acid bacteria or urea ammoniation.",
                "warnings": "Feed alongside protein supplements.",
            },
        ],
        "B": [
            {
                "application": "Acoustic Insulation Board",
                "suitability_explanation": "Porous stalk pith traps sound waves, suitable for eco-construction drywall cores.",
                "processing_requirements": "Defibration and bio-resin compression.",
                "warnings": "Treat with eco-friendly fire retardants.",
            },
            {
                "application": "Soil Erosion Control Blankets",
                "suitability_explanation": "Coarse stalks retain sloped topsoil on highway embankments and watershed trenches.",
                "processing_requirements": "Needle-punching with jute backing.",
                "warnings": "Stake securely into slope contours.",
            },
        ],
        "C": [
            {
                "application": "Controlled Biomass Boiler Feedstock",
                "suitability_explanation": "Direct combustion in thermal bio-power utilities.",
                "processing_requirements": "Tub-grinding to 5 cm particle size.",
                "warnings": "High chlorine content can cause boiler superheater corrosion if unmanaged.",
            },
        ],
    },
    "Banana Waste": {
        "A": [
            {
                "application": "High-Tensile Textile & Kraft Paper Fibers",
                "suitability_explanation": "Banana pseudostem fibers have high tensile strength (up to 600 MPa) for handicraft, eco-bags, and currency paper.",
                "processing_requirements": "Raspador machine mechanical extraction, freshwater scouring, and sun drying.",
                "warnings": "Extract within 48 hours of harvest to avoid sap discoloration.",
            },
            {
                "application": "Enriched Liquid Bio-Fertilizer (Banana Sap)",
                "suitability_explanation": "Expressed pseudostem sap is loaded with natural potassium (K2O), cytokinins, and plant growth micronutrients.",
                "processing_requirements": "Collect extracted sap, ferment with trichoderma, filter for foliar spray.",
                "warnings": "Dilute 1:10 with water before crop application.",
            },
        ],
        "B": [
            {
                "application": "Vermicompost & Microbial Humus",
                "suitability_explanation": "High moisture and soft parenchyma tissue decompose rapidly into nutrient-dense vermicompost.",
                "processing_requirements": "Chop into 10 cm chunks, sun-wilt for 3 days, feed to earthworms (Eisenia fetida).",
                "warnings": "Do not let composting pile turn soggy or waterlogged.",
            },
        ],
        "C": [
            {
                "application": "Anaerobic Digester Biogas Feedstock",
                "suitability_explanation": "Rapidly converts to biomethane in continuous stirred-tank anaerobic digesters.",
                "processing_requirements": "Shredding and co-digestion with dairy manure (1:1 ratio).",
                "warnings": "Control pH buffering with lime if slurry becomes acidic.",
            },
        ],
    },
    "Cotton Stalk": {
        "A": [
            {
                "application": "High-Quality Particle Board & Medium Density Fiberboard (MDF)",
                "suitability_explanation": "Woody stalk density comparable to deciduous hardwoods; produces water-resistant furniture panels.",
                "processing_requirements": "Debarking, chipper shredding, resin coating, and hydraulic hot press (180°C).",
                "warnings": "Stalks must be uprooted without taproot soil clumps.",
            },
            {
                "application": "Biochar Retort Carbon Sink",
                "suitability_explanation": "Dense woody structure yields 30-35% biochar with >75% fixed carbon for carbon-credit trading.",
                "processing_requirements": "Pyrolysis at 500°C in anoxic retort kilns.",
                "warnings": "Quench with water to stabilize pore matrix.",
            },
        ],
        "B": [
            {
                "application": "Biomass Gasification & Power Briquettes",
                "suitability_explanation": "High calorific value (~4,000 kcal/kg) for dual-fuel diesel gasifiers and brick kilns.",
                "processing_requirements": "Crushing and high-pressure briquetting without binder.",
                "warnings": "Keep moisture <15% for efficient gasification.",
            },
        ],
        "C": [
            {
                "application": "Industrial Boiler Co-Firing",
                "suitability_explanation": "Direct thermal substitute for coal in cement and power plants.",
                "processing_requirements": "Coarse chipping and magnetic separation of field wires.",
                "warnings": "Remove field stones to prevent chipper knife dulling.",
            },
        ],
    },
    "Other Agricultural Residues": {
        "A": [
            {
                "application": "Circular Biomass Pelletizing & Briquetting",
                "suitability_explanation": "Clean dry agricultural residues can be blended for industrial heating fuel pellets.",
                "processing_requirements": "Size reduction to 3-6mm and hydraulic pellet extrusion.",
                "warnings": "Verify composite moisture is strictly below 15%.",
            },
            {
                "application": "Microbial Bokashi & Soil Regeneration Composting",
                "suitability_explanation": "Recovers vital nitrogen, phosphorus, and potassium back into farm soil biology.",
                "processing_requirements": "Shred and inoculate with beneficial aerobic microbes.",
                "warnings": "Maintain adequate moisture (50-60%) in the compost pile.",
            },
        ],
        "B": [
            {
                "application": "Industrial Thermal Boiler Feedstock",
                "suitability_explanation": "Provides green energy substitution for coal in local agro-processing factories.",
                "processing_requirements": "Baling or chipping for pneumatic boiler feeding.",
                "warnings": "Check ash fusion temperature for the specific crop variety.",
            },
        ],
        "C": [
            {
                "application": "Pyrolysis Biochar & Controlled Land Application",
                "suitability_explanation": "Safely stabilizes deteriorated residues while eliminating open-field burning smoke.",
                "processing_requirements": "Low-oxygen pyrolysis carbonization.",
                "warnings": "Do not burn in open heaps to avoid PM2.5 and carbon emissions.",
            },
        ],
    },
}


def get_recommendations_for_waste(
    waste_type: str,
    grade_code: str = "A",
    visible_damage: str = "Low",
    visible_contamination: str = "Low",
) -> List[Dict[str, Any]]:
    """
    Returns curated, grade-appropriate circular economy recommendations.
    Enforces quality safeguards: heavily contaminated or mouldy waste
    is never recommended for sensitive uses like mushroom substrate or animal feed.
    """
    cat_recs = RECOMMENDATION_DATABASE.get(waste_type, RECOMMENDATION_DATABASE["Other Agricultural Residues"])
    recs = cat_recs.get(grade_code, cat_recs.get("B", []))

    # Safety filters
    is_contaminated = "high" in visible_contamination.lower() or "mould" in visible_contamination.lower()
    filtered: List[Dict[str, Any]] = []

    for r in recs:
        app_name = r["application"].lower()
        # Disallow mushroom or feed if contaminated
        if is_contaminated and ("mushroom" in app_name or "fodder" in app_name or "feed" in app_name):
            continue
        filtered.append(r)

    # Fallback if all were filtered
    if not filtered:
        filtered = cat_recs.get("C", [
            {
                "application": "Controlled Thermal Boiler Feedstock",
                "suitability_explanation": "Material has quality limitations; suited for regulated industrial combustion or composting.",
                "processing_requirements": "Pre-drying and segregation.",
                "warnings": "Ensure emissions control compliance.",
            }
        ])

    return filtered[:3]  # Return top 3 most relevant applications
