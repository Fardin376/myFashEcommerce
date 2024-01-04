import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    category: String,
    sizes: Array,
    onSale: String,
    price: Number,
    priceDrop: Number,
    deliveryInfo: String,
    imageUrl: String,
  },
  { timestamps: true }
);

const Product = mongoose.models.Products || mongoose.model('Products', ProductSchema);

export default Product;
