const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jose = require('jose');

const addressSchema = new mongoose.Schema(
  {
    formattedAddress: {
      type: String,
      maxlength: 100,
      trim: true,
    },
    apartment: {
      type: String,
      maxlength: 50,
      trim: true,
    },
    building: {
      type: String,
      maxlength: 50,
      trim: true,
    },
    street: {
      type: String,
      maxlength: 100,
      lowercase: true,
      trim: true,
    },
    city: {
      type: String,
      maxlength: 100,
      lowercase: true,
      trim: true,
    },
    state: {
      type: String,
      maxlength: 50,
      lowercase: true,
      trim: true,
    },
    country: {
      type: String,
      maxlength: 50,
      lowercase: true,
      trim: true,
    },
    zipCode: {
      type: String,
      maxlength: 20,
      lowercase: true,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [{ type: Number }],
        required: true,
      },
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide first name'],
      maxlength: 20,
      minlength: 3,
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Please provide last name'],
      maxlength: 20,
      minlength: 3,
      lowercase: true,
      trim: true,
    },
    farmName: {
      type: String,
      required: [true, 'Please provide farm name'],
      maxlength: 50,
      minlength: 3,
      lowercase: true,
      trim: true,
    },
    cellPhone: {
      type: String,
      maxlength: 20,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 50,
      minlength: 8,
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['user', 'operator'],
      default: 'user',
      lowercase: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      lowercase: true,
      trim: true,
    },
    dob: {
      type: Date,
      trim: true,
    },
    dryermasterId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Dryermaster',
      required: [true, 'Please provide Dryermaster details'],
    },
    stripeCustomerId: {
      type: String,
      trim: true,
    },
    active: { type: Boolean, default: true },
    verified: {
      type: Boolean,
      default: false,
    },

    address: addressSchema, // Group address-related properties inside the "address" object
    recoveryToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//  JWT token creation
userSchema.methods.createJWT = async function () {
  const alg = 'HS256';

  return await new jose.SignJWT({ userId: this._id, name: this.firstName })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(this.role)
    .setAudience(`urn:example:audience`)
    .setExpirationTime(process.env.JWT_EXPIRES_IN)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
};

//  compare password with hashed password

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};
//  password reset token

userSchema.methods.createPasswordResetToken = async function () {
  const alg = 'HS256';
  const resetToken = await new jose.SignJWT({
    userId: this._id,
    name: this.firstName,
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(this.role)
    .setAudience(`urn:example:audience`)
    .setExpirationTime(process.env.JWT_PASSWORD_RESET_EXPIRES_IN)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
