import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user";
dotenv.config();

export const checkPermission = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const token = req.headers.authorization.split(" ")[1];

        const { _id } = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        if (user.role !== "admin") {
            return res.status(401).json({
                message: "Bạn không có quyền truy cập tài nguyên",
            });
        }

        req.user = user;
        next();
    } catch (error) { }
};