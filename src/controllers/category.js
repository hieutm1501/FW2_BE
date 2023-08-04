import dotenv from "dotenv";
import joi from "joi";
import Product from "../models/product";
import Category from "../models/category";

dotenv.config();

const categorySchema = joi.object({
    name: joi.string().required(),
});

export const getAll = async (req, res) => {
    try {
        const categories = await Category.find({});
        if (!categories) {
            return res.json({
                message: "Không tìm thấy sản phẩm",
            });
        }
        return res.json({
            message: "Lấy sản phẩm thành công",
            categories,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};
export const get = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate("products");
        console.log("category", category);
        if (!category) {
            return res.json({
                message: "Không tìm thấy danh mục",
            });
        }
        const products = await Product.find({ categoryId: req.params.id });
        return res.json({
            message: "Lấy danh mục thành công",
            category: {
                ...category.toObject(),
                products,
            },
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};
export const create = async (req, res) => {
    try {
        // validate
        const { error } = categorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }
        const category = await Category.create(req.body);
        if (!category) {
            return res.json({
                message: "Thêm danh mục không thành công",
            });
        }
        return res.json({
            message: "Thêm danh mục thành công",
            category,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};
export const updateCategories = async (req, res) => {
    try {
        // chưa validate
        const category = await Category.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
        });
        if (!category) {
            return res.json({
                message: "Sửa danh mục không thành công",
            });
        }
        return res.json({
            message: "Sửa danh mục thành công",
            category,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
export const getdelete = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        res.json({
            message: "xoá thanh cong",
            category,
        })
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}