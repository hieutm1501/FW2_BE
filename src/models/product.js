import mongoose from "mongoose";
import Cart from './cart'
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        image: {
            type: Array
        },
        price: {
            type: Number,
        },
        categoryId: {
            type: mongoose.Types.ObjectId,
            ref: "Category",
        },
        cartId: {
            type: mongoose.Types.ObjectId,
            ref: "Cart",
        },
    },
    { timestamps: true, versionKey: false }

);

productSchema.pre("save", async function (next) {
    if (this.isNew) {
        const product = this;
        const cart = await Cart.findById(product.cartId);
        cart.products.push(product._id);
        await cart.save();
    }
    next();
});
export default mongoose.model("Product", productSchema);