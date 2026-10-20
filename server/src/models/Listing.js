import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    generator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A listing must belong to a waste generator'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a listing title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    wasteType: {
      type: String,
      required: [true, 'Please select a waste type'],
      enum: {
        values: [
          'Paddy Straw',
          'Coconut Husk',
          'Sugarcane Bagasse',
          'Areca Leaf',
          'Cotton Stalk',
          'Corn Stover',
          'Wheat Straw',
          'Other',
        ],
        message: '{VALUE} is not a supported crop residue type',
      },
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    quantityKg: {
      type: Number,
      required: [true, 'Please specify the total available quantity in kg'],
      min: [1, 'Quantity must be at least 1 kg'],
    },
    availableQuantityKg: {
      type: Number,
      min: [0, 'Available quantity cannot be negative'],
    },
    pricePerKg: {
      type: Number,
      required: [true, 'Please specify price per kg (use 0 for free exchange)'],
      min: [0, 'Price per kg cannot be negative'],
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: function () {
        return this.pricePerKg === 0;
      },
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
      },
    ],
    qualityGrade: {
      type: String,
      enum: ['Grade A (High)', 'Grade B (Medium)', 'Grade C (Low)', 'Pending Assessment'],
      default: 'Pending Assessment',
    },
    moisturePercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    verificationDetails: {
      verifiedAt: { type: Date },
      confidenceScore: { type: Number, min: 0, max: 1 },
      verifiedBy: {
        type: String,
        enum: ['AI_CNN', 'Admin', 'None'],
        default: 'None',
      },
    },
    // GeoJSON Point format for MongoDB 2dsphere indexing and spatial queries
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude] — Note: GeoJSON requires [lng, lat]
        required: [true, 'Please provide geographic coordinates [longitude, latitude]'],
      },
      address: {
        type: String,
        required: [true, 'Please provide a readable address or village/district'],
      },
      city: { type: String, trim: true },
      state: { type: String, default: 'Karnataka', trim: true },
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'completed', 'expired'],
      default: 'available',
      index: true,
    },
    availableUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// MongoDB 2dsphere index for proximity / $near / $geoWithin queries
listingSchema.index({ location: '2dsphere' });

// Compound indexes for fast filtered searches (e.g., status + wasteType + createdAt)
listingSchema.index({ status: 1, wasteType: 1 });
listingSchema.index({ createdAt: -1 });

// Ensure availableQuantityKg defaults to quantityKg on new listings
listingSchema.pre('save', function (next) {
  if (this.isNew && this.availableQuantityKg === undefined) {
    this.availableQuantityKg = this.quantityKg;
  }
  this.isFree = this.pricePerKg === 0;
  next();
});

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
