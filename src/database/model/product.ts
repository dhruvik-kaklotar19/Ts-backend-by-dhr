import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const productModel = mongoose.models.product || mongoose.model('product', productSchema);
