const ProductInforRepository = require("../repositories/productInforRepository");

class ProductInforController {
    static async getSizes(req, res) {
        try {
            const sizes = await ProductInforRepository.GetProductSize();
            res.status(200).json({
                success: true,
                message: "Lấy danh sách size thành công",
                data: sizes
            });
        } catch (error) {
            console.error("Lỗi khi lấy size:", error);
            res.status(500).json({
                success: false,
                message: "Lỗi server khi lấy size"
            });
        }
    }
    static async addColor(req, res) {
        try {
            const { color } = req.body;
            if (!color) {
                return res.status(400).json({ success: false, message: 'Tên màu không được để trống' });
            }

            const result = await ProductInforRepository.AddProductColor(color);
            if (!result.success) {
                return res.status(409).json({ success: false, message: result.message });
            }

            res.status(201).json({ success: true, insertedId: result.insertedId });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
    static async addSize(req, res) {
        try {
            const { size,unit } = req.body;
            if (!size && !unit ) {
                return res.status(400).json({ success: false, message: 'Kich thuoc va don vi không được để trống' });
            }

            const result = await ProductInforRepository.AddProductSize(size,unit);
            if (!result.success) {
                return res.status(409).json({ success: false, message: result.message });
            }

            res.status(201).json({ success: true, insertedId: result.insertedId });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    static async getColors(req, res) {
        try {
            const colors = await ProductInforRepository.GetProductColor();
            res.status(200).json({
                success: true,
                message: "Lấy danh sách màu sắc thành công",
                data: colors
            });
        } catch (error) {
            console.error("Lỗi khi lấy màu sắc:", error);
            res.status(500).json({
                success: false,
                message: "Lỗi server khi lấy màu sắc"
            });
        }
    }

    static async getBrands(req, res) {
        try {
            const brands = await ProductInforRepository.GetProductBrand();
            res.status(200).json({
                success: true,
                message: "Lấy danh sách thương hiệu thành công",
                data: brands
            });
        } catch (error) {
            console.error("Lỗi khi lấy thương hiệu:", error);
            res.status(500).json({
                success: false,
                message: "Lỗi server khi lấy thương hiệu"
            });
        }
    }

    static async getDiscounts(req, res) {
        try {
            const discounts = await ProductInforRepository.GetProductDiscount();
            res.status(200).json({
                success: true,
                message: "Lấy danh sách giảm giá thành công",
                data: discounts
            });
        } catch (error) {
            console.error("Lỗi khi lấy giảm giá:", error);
            res.status(500).json({
                success: false,
                message: "Lỗi server khi lấy giảm giá"
            });
        }
    }

    static async getTypes(req, res) {
        try {
            const types = await ProductInforRepository.GetProductType();
            res.status(200).json({
                success: true,
                message: "Lấy danh sách loại sản phẩm thành công",
                data: types
            });
        } catch (error) {
            console.error("Lỗi khi lấy loại sản phẩm:", error);
            res.status(500).json({
                success: false,
                message: "Lỗi server khi lấy loại sản phẩm"
            });
        }
    }
    static async addsTypes(req, res) {
        try {
            const name = req.body.name
            const types = await ProductInforRepository.AddProductType(name);
            res.status(200).json({
                success: true,
                message: "Lấy danh sách loại sản phẩm thành công",
                data: types
            });
        } catch (error) {
            console.error("Lỗi khi lấy loại sản phẩm:", error);
            res.status(500).json({
                success: false,
                message: "Lỗi server khi lấy loại sản phẩm"
            });
        }
    }
}

module.exports = ProductInforController;
