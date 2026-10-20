import mongoose from 'mongoose';

const exchangeSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: [true, 'An exchange must reference a listing'],
      index: true,
    },
    generator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'An exchange must reference the waste generator (farmer)'],
      index: true,
    },
    utilizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'An exchange must reference the waste utilizer (buyer)'],
      index: true,
    },
    quantityKg: {
      type: Number,
      required: [true, 'Please specify the quantity requested in kg'],
      min: [1, 'Requested quantity must be at least 1 kg'],
    },
    unitPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'accepted', 'rejected', 'in_transit', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid exchange status',
      },
      default: 'pending',
      index: true,
    },
    proposedPickupDate: {
      type: Date,
      required: [true, 'Please propose a preferred pickup date'],
    },
    actualPickupDate: {
      type: Date,
    },
    deliveryMethod: {
      type: String,
      enum: ['self_pickup', 'farmer_delivery', 'third_party_transport'],
      default: 'self_pickup',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    // Environmental impact tracking (Feeds into Slide 10/11 Impact Dashboard)
    impactMetrics: {
      biomassDivertedKg: {
        type: Number,
        default: 0,
      },
      // Avoided open-field burning emission: ~1.46 kg CO2e per 1 kg dry crop residue
      co2MitigatedKg: {
        type: Number,
        default: 0,
      },
    },
    rating: {
      score: { type: Number, min: 1, max: 5 },
      feedback: { type: String, trim: true },
      ratedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for querying exchanges by user and status
exchangeSchema.index({ generator: 1, status: 1 });
exchangeSchema.index({ utilizer: 1, status: 1 });
exchangeSchema.index({ listing: 1, status: 1 });

// Calculate totalAmount and environmental impact metrics on save
exchangeSchema.pre('save', function (next) {
  if (this.isModified('quantityKg') || this.isModified('unitPrice')) {
    this.totalAmount = (this.quantityKg || 0) * (this.unitPrice || 0);
  }

  // When exchange is marked as completed, record avoided emissions
  if (this.status === 'completed' && (!this.impactMetrics || this.impactMetrics.biomassDivertedKg === 0)) {
    this.impactMetrics = {
      biomassDivertedKg: this.quantityKg,
      co2MitigatedKg: Number((this.quantityKg * 1.46).toFixed(2)),
    };
    if (!this.actualPickupDate) {
      this.actualPickupDate = new Date();
    }
  }

  next();
});

const Exchange = mongoose.model('Exchange', exchangeSchema);
export default Exchange;
