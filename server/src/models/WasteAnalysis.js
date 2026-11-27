import mongoose from 'mongoose';

const wasteAnalysisSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Analysis must be associated with a registered farmer/user'],
      index: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      default: null,
      index: true,
    },
    image_url: {
      type: String,
      required: [true, 'An agricultural waste image URL or upload path is required'],
    },
    detected_waste_type: {
      type: String,
      required: true,
      index: true,
    },
    farmer_selected_waste_type: {
      type: String,
    },
    identification_confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.85,
    },
    visual_observations: {
      colour: { type: String, default: 'Natural/Golden' },
      visible_condition: { type: String, default: 'Good' },
      visible_damage: { type: String, default: 'Low' },
      visible_contamination: { type: String, default: 'Low' },
      visible_deterioration: { type: String, default: 'Not detected' },
      fungal_growth: { type: String, default: 'Not visibly detected' },
    },
    farmer_details: {
      quantity_kg: { type: Number, required: true, min: 1 },
      moisture_percentage: { type: Number, min: 0, max: 100, default: null },
      storage_condition: { type: String, default: 'Covered storage' },
      harvest_date: { type: String },
      location: { type: String },
      additional_description: { type: String, trim: true },
      is_dried: { type: Boolean, default: false },
    },
    preliminary_grade: {
      type: String,
      enum: ['A', 'B', 'C', 'Pending'],
      default: 'Pending',
    },
    final_grade: {
      type: String,
      enum: [
        'Grade A (High Quality)',
        'Grade B (Medium Quality)',
        'Grade C (Low Quality)',
        'Grade A',
        'Grade B',
        'Grade C',
        'Pending Assessment',
      ],
      default: 'Pending Assessment',
      index: true,
    },
    quality_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    assessment_completeness: {
      type: Number,
      min: 0,
      max: 100,
      default: 80,
    },
    score_breakdown: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    grading_rules_version: {
      type: String,
      default: '1.0.0-provisional',
    },
    recommendations: [
      {
        application: { type: String, required: true },
        suitability_explanation: { type: String },
        processing_requirements: { type: String },
        warnings: { type: String },
      },
    ],
    valuation: {
      estimated_price_per_kg: { type: Number, default: 0 },
      quantity_kg: { type: Number, default: 0 },
      estimated_total_value: { type: Number, default: 0 },
      currency: { type: String, default: 'INR (₹)' },
      pricing_basis: { type: String },
      price_reliability_indicator: { type: String, default: 'High' },
    },
    verified_by: {
      type: String,
      enum: ['AI_Gemini', 'AI_CNN_Fallback', 'Admin', 'Pending'],
      default: 'AI_Gemini',
    },
    admin_review: {
      reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      verified_grade: { type: String },
      notes: { type: String },
      reviewed_at: { type: Date },
    },
    status: {
      type: String,
      enum: ['draft', 'assessed', 'published', 'rejected'],
      default: 'assessed',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

wasteAnalysisSchema.index({ farmer: 1, createdAt: -1 });
wasteAnalysisSchema.index({ detected_waste_type: 1, final_grade: 1 });

const WasteAnalysis = mongoose.model('WasteAnalysis', wasteAnalysisSchema);
export default WasteAnalysis;
