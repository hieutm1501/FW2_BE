import Bill from '../models/bill'


// Get All bill
export const getBills = async (req, res) => {
    try {
        const bill = await Bill.find({}).populate("userId");

        if (bill.length === 0) {
            return res.status(400).json({ message: "Không có đơn nào!" });
        }

        return res.json({
            message: "Lấy danh sách tất cả đơn hàng thành công!",
            bill,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// LẤY GIỎ HÀNG CỦA NGƯỜI DÙNG !!
export const getOneBill = async (req, res) => {
    const { _id: userId } = req.user;

    try {
        // Tìm kiếm giỏ hàng của người dùng
        const bill = await Bill.findOne({ userId }).populate("cartId").populate("userId");
        console.log(bill);

        if (!bill) {
            return res.status(400).json({ message: "Không có đơn nào của người dùng!" });
        }

        return res.json({
            message: "Lấy đơn thành công!",
            bill,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// THANH TOÁN GIỎ HÀNG CỦA NGƯỜI DÙNG
export const checkBill = async (req, res) => {
    const { _id: userId } = req.user;
    const { cartId, name, location, phone } = req.body;
    try {
        // THANH TOÁN 
        const bill = await Bill.findOne({ userId })
            .populate("cartId")
            .populate("userId");
        if (!bill) {
            const billCreate = await Bill.create({
                userId,
                cartId,
                name,
                phone,
                location
            });
        } else {
            return res.status(400).json({
                message: "Bạn đã thanh toán rồi!",
            });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
export const updateBillStatus = async (req, res) => {
    const { status } = req.body;
    try {
        // Kiểm tra xem hóa đơn có tồn tại hay không
        const bill = await Bill.findById({ _id: req.params.id });
        console.log(bill);
        if (!bill) {
            return res.status(404).json({
                message: "Không tìm thấy hóa đơn!",
            });
        }

        // Cập nhật trạng thái hóa đơn
        bill.status = status;
        await bill.save();

        return res.status(200).json({
            message: "Cập nhật trạng thái hóa đơn thành công!",
            bill,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// NGƯỜI DÙNG HUỶ ĐƠN HÀNG ( CẬP NHẬT THEO STATUS )
export const cancelBill = async (req, res) => {
    const { _id: userId } = req.user;

    try {
        // Tìm kiếm và kiểm tra xem có đơn hàng của người dùng hay không
        const bill = await Bill.findOne({ userId }).populate("cartId").populate("userId");
        if (!bill) {
            return res.status(400).json({ message: "Không có đơn hàng nào của người dùng!" });
        }

        // Kiểm tra xem đơn hàng đã bị hủy trước đó chưa
        if (bill.status === "Cancelled") {
            return res.status(400).json({ message: "Đơn hàng đã bị hủy trước đó!" });
        }

        // Hủy đơn hàng
        bill.status = "Cancelled";
        await bill.save();

        return res.status(200).json({
            message: "Hủy đơn hàng thành công!",
            bill,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};