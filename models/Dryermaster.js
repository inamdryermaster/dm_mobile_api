// dryermasters/dryermaster.js

const mongoose = require('mongoose');

const dryermasterSchema = new mongoose.Schema(
  {
    dmSerial: {
      type: String,
      required: [true, 'Please enter dryermaster serial number'],
      trim: true,
      maxLength: [20, 'Dryermaster serial number cannot exceed 100 characters'],
      unique: true,
    },
    dmPassword: {
      type: String,
      required: [true, 'Please enter dryermaster password'],
      trim: true,
      maxLength: [20, 'Dryermaster password cannot exceed 100 characters'],
    },
    totalOperators: {
      type: Number,
      default: 5,
      required: [true, 'Please enter total operators'],
      trim: true,
      maxLength: [20, 'Total operators cannot exceed 100 characters'],
    },
    subscriptionExpiry: {
      type: Date,
      trim: true,
      maxLength: [20, 'Subscription expiry date cannot exceed 100 characters'],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'Employee',
      required: [true, 'Please enter employee'],
    },
  },
  {
    timestamps: true,
  }
);

const Dryermaster = mongoose.model('Dryermaster', dryermasterSchema);

module.exports = Dryermaster;
