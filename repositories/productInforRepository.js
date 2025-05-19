const db = require("../configs/db");

class ProductInforRepository{
    static async AddProductColor(color_name) {
        const connection = await db.getConnection();
        try {
            const [existing] = await connection.query(
                "SELECT * FROM product_color WHERE color = ?",
                [color_name]
            );
    
            if (existing.length > 0) {
                return { success: false, message: "Màu đã tồn tại" };
            }
    
            const [result] = await connection.query(
                "INSERT INTO product_color (color) VALUES (?)",
                [color_name]
            );
            return { success: true, insertedId: result.insertId };
        } catch (err) {
            console.error("Lỗi khi thêm màu sản phẩm:", err);
            return { success: false, error: err.message };
        } finally {
            connection.release();
        }
    }
    static async AddProductSize(size,unit) {
        const connection = await db.getConnection();
        try {
            const [existing] = await connection.query(
                "SELECT * FROM product_size WHERE size = ? AND unit = ?",
                [size,unit]
            );
    
            if (existing.length > 0) {
                return { success: false, message: "Kích thước đã tồn tại" };
            }
    
            const [result] = await connection.query(
                "INSERT INTO product_size (size,unit) VALUES (?,?)",
                [size,unit]
            );
            return { success: true, insertedId: result.insertId };
        } catch (err) {
            console.error("Lỗi khi thêm kích thước sản phẩm:", err);
            return { success: false, error: err.message };
        } finally {
            connection.release();
        }
    }
    
    static async GetProductSize(){
        const connection = await db.getConnection(); // Lấy kết nối từ pool
        try {
          const [rows] = await connection.query("SELECT * FROM product_size");
          return rows;
        } finally {
          connection.release(); // Giải phóng kết nối
        }
    }
    static async GetProductColor(){
        const connection = await db.getConnection(); // Lấy kết nối từ pool
        try {
          const [rows] = await connection.query("SELECT * FROM product_color");
          return rows;
        } finally {
          connection.release(); // Giải phóng kết nối
        }
    }
    static async GetProductBrand(){
        const connection = await db.getConnection(); // Lấy kết nối từ pool
        try {
          const [rows] = await connection.query("SELECT * FROM brands");
          return rows;
        } finally {
          connection.release(); // Giải phóng kết nối
        }
    }
    static async GetProductDiscount(){
        const connection = await db.getConnection(); // Lấy kết nối từ pool
        try {
          const [rows] = await connection.query("SELECT * FROM discounts");
          return rows;
        } finally {
          connection.release(); // Giải phóng kết nối
        }
    }
    static async GetProductType(){
        const connection = await db.getConnection(); // Lấy kết nối từ pool
        try {
          const [rows] = await connection.query("SELECT * FROM product_type");
          return rows;
        } finally {
          connection.release(); // Giải phóng kết nối
        }
    }
    static async AddProductType(name){
        const connection = await db.getConnection(); // Lấy kết nối từ pool
        try {
          const query = "INSERT INTO product_type(name) VALUES (?)";
          const [result] = await db.query(query, [name]);
            return result.insertId;
        } finally {
          connection.release(); // Giải phóng kết nối
        }
    }
}
module.exports = ProductInforRepository