const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Cấu hình nơi lưu ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Thư mục lưu ảnh
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file theo timestamp
    },
});

// Middleware upload file
const upload = multer({ storage: storage });

class ImageController {
    static async uploadImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: "Không có file nào được upload" });
            }
    
            res.status(200).json({
                success: true,
                message: "Upload thành công",
                filename: req.file.filename,
                url: `/api/images/${req.file.filename}`
            });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    static async getImages(req, res) {
        try {
            const files = fs.readdirSync("uploads/");
            const images = files.map(file => ({ name: file, url: `/api/images/${file}` }));
            res.json(images);
        } catch (err) {
            res.status(500).json({ error: "Không thể lấy danh sách ảnh" });
        }
    }

    static async deleteImage(filename) {
        try {
            const filePath = path.join("uploads", filename);
    
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                // console.log("Xóa ảnh thành công:", filename);
            } else {
                console.warn("Ảnh không tồn tại:", filename);
            }
        } catch (err) {
            console.error("Lỗi khi xóa ảnh:", err);
        }
    }
    
}

// Xuất cả `upload` và `ImageController`
module.exports = { upload, ImageController };
