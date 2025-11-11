import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: { type: String, default: null },
    email: { type: String, default: null, lowercase: true, trim: true },
    password: { type: String, default: null, trim: true },
    proImage: { type: String, default: null, trim: true },
    otp: { type: Number, default: null },
    otpExpireTime: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    isVerify: { type: Boolean, default: false },
    userType: { type: Number, default: null, enum: [1, 0] },                  //1-user , 0-admin
    deviceToken: { type: [{ type: String }], default: [] },
}, { timestamps: true })

export const userModel = mongoose.model('user', userSchema);
