import mongoose from 'mongoose';

const referencePriceSchema = new mongoose.Schema(
  {
    waste_category: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    grade_a_price: {
      type: Number,
      required: true,
      min: 0,
    },
    grade_b_price: {
      type: Number,
      required: true,
      min: 0,
    },
    grade_c_price: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      default: 'Karnataka, India',
    },
    source: {
      type: String,
      default: 'Administrator Benchmark',
    },
    last_updated: {
      type: Date,
      default: Date.now,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ReferencePrice = mongoose.model('ReferencePrice', referencePriceSchema);
export default ReferencePrice;
