import Cart from '../models/cart'
import User from "../models/user";
import Product from "../models/product";


// Get All Cart
export const getCarts = async (req, res) => {
    try {
        const carts = await Cart.find({});

        if (carts.length === 0) {
            return res.status(400).json({ message: "Không có giỏ hàng nào!" });
        }

        return res.json({
            message: "Lấy danh sách giỏ hàng thành công!",
            carts,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Get One Cart
export const getCart = async (req, res) => {
    const { _id: userId } = req.user;

    try {
        // Tìm kiếm giỏ hàng của người dùng
        const cart = await Cart.findOne({ userId }).populate("products.productId").populate("userId");

        if (!cart) {
            return res.status(400).json({ message: "Không có giỏ hàng nào của người dùng!" });
        }

        return res.json({
            message: "Lấy giỏ hàng thành công!",
            cart,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Add To Cart
export const addToCart = async (req, res) => {
    const { _id: userId } = req.user;
    const { productId, quantity } = req.body;

    try {
        // Kiểm tra xem user có giỏ hàng hay chưa
        const cart = await Cart.findOne({ userId })
            .populate("products.productId")
            .populate("userId");

        // Nếu chưa có giỏ hàng thì tạo mới
        if (!cart) {
            const cartCreate = await Cart.create({
                userId,
                products: [],
                shippingFee: 100,
            });

            // Cập nhật id của Cart trong collection User
            await User.findByIdAndUpdate(userId, { cartId: cartCreate._id });

            // Kiểm tra xem productId có phải là ObjectId hợp lệ không
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ message: "productId không hợp lệ" });
            }

            // Thêm sản phẩm vào giỏ hàng mới
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
            }
            cartCreate.products.push({ productId: product._id, quantity: quantity || 1, price: product.price });
            await cartCreate.save();

            return res.status(200).json({
                message: "Sản phẩm đã được thêm vào giỏ hàng!",
                cart: cartCreate,
            });
        }

        // Nếu đã có giỏ hàng thì cập nhật sản phẩm vào giỏ hàng
        const productIndex = cart && cart.products ? cart.products.findIndex(
            (p) => p.productId && p.productId.toString() === productId
        ) : -1;

        if (productIndex === -1) {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
            }
            cart.products.push({ productId: product._id, quantity: quantity || 1, price: product.price });
        } else {
            cart.products[productIndex].quantity = quantity || 1;
        }
        await cart.save();

        return res.status(200).json({
            message: "Sản phẩm đã được thêm vào giỏ hàng!",
            cart,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//DELETE CART

export const deleteProductCart = async (req, res) => {
    const { _id: userId } = req.user;
    const { productId } = req.params;
    try {
        // Tìm kiếm giỏ hàng của người dùng
        let cart = await Cart.findOne({ userId })
            .populate("products.productId")
            .populate("userId");

        // Nếu không tìm thấy giỏ hàng, trả về lỗi
        if (!cart) {
            return res.status(400).json({ message: "Giỏ hàng không tồn tại!" });
        }

        // Xóa sản phẩm khỏi giỏ hàng
        cart.products = cart.products.filter(
            (product) => product.productId._id.toString() !== productId
        );


        await cart.save();

        return res.status(200).json({ message: "Xóa sản phẩm thành công!", cart });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};