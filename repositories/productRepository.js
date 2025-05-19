const db = require("../configs/db");
const ProductModel = require("../models/productModel");

class ProductRepository {
  static async getAllProducts() {
    const connection = await db.getConnection(); // Lấy kết nối từ pool
    try {
      const [rows] = await connection.query(`SELECT 
    products.id AS product_id,
    products.name AS name,
    product_size.size AS size,
    product_size.unit AS unit,
    product_color.color AS color,
    products.price,
    discounts.rate AS discount,
    products.imgName,
    products.type_id AS type_id,
    brands.name AS brand,
    product_type.name AS type,
    products.description AS description,
    storage.amount AS amount,
    products.id AS id
    FROM 
        products
    JOIN product_type ON products.type_id = product_type.id
    JOIN storage ON storage.product_id = products.id
    JOIN product_size ON product_size.id = products.size_id
    JOIN product_color ON product_color.id = products.color_id
    JOIN brands ON brands.id = products.brand_id
    LEFT JOIN discounts ON discounts.id = products.discount_id;
`);
      return rows;
    } finally {
      connection.release(); // Giải phóng kết nối
    }
  }


  static async createProduct(name, price, description, typeId, imgName, brandId, sizeId, colorId, discountId) {
    const connection = await db.getConnection();
    try {
      const query = `
        INSERT INTO products (
          name, price, description, type_id, imgName,
          brand_id, size_id, color_id, discount_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
      const params = [
        name, price, description, typeId, imgName,
        brandId, sizeId, colorId, discountId
      ];
  
      const [result] = await connection.query(query, params);
  
      return {
        id: result.insertId,
        name,
        price,
        description,
        type_id: typeId,
        imgName,
        brand_id: brandId,
        size_id: sizeId,
        color_id: colorId,
        discount_id: discountId
      };
    } finally {
      connection.release();
    }
  }
  static async createProductStorage(product_id, importDate) {
    const connection = await db.getConnection();
    try {
      const query = `INSERT INTO storage (product_id, amount, import_date) VALUES (?, 0, ?)`;
      const [result] = await connection.execute(query, [product_id, importDate]);
      return result;
    } catch (err) {
      console.error("Lỗi khi tạo kho sản phẩm:", err);
      throw err;
    } finally {
      connection.release();
    }
  }
  static async addProductStorage(product_id, add_amount, importDate) {
    const connection = await db.getConnection();
    try {
      const query = `
        UPDATE storage 
        SET amount = amount + ?, import_date = ?
        WHERE product_id = ?
      `;
    //   console.log(add_amount)
      const [result] = await connection.execute(query, [add_amount, importDate, product_id]);
      return result;
    } catch (err) {
      console.error("Lỗi khi cập nhật kho sản phẩm:", err);
      throw err;
    } finally {
      connection.release();
    }
  }  

  static async updateProduct(id, name, price, description,typeId,imgName) {
    const connection = await db.getConnection();
    try {
      const query = "UPDATE products SET name = ?, price = ?, description = ?, type_id = ?, imgName = ? WHERE id = ?";
      const params = [name, price, description, typeId, imgName, id];
      await connection.query(query, params);
      return { message: "Product updated successfully" };
    } finally {
      connection.release();
    }
  }
  static async deleteProductStorage(id) {
    const connection = await db.getConnection();
    try {
      const query = "DELETE FROM storage WHERE product_id = ?";
      const params = [id];
    //   console.log(id)
      await connection.query(query, params);
      return { message: "Product deleted successfully" };
    } finally {
      connection.release();
    }
  }
  static async deleteAccOrderByProductId(product_id){
    const connection = await db.getConnection();
    try {
      const query = `DELETE account_oders
        FROM account_oders
        JOIN orders ON account_oders.order_id = orders.id
        WHERE orders.product_id = ?;
        `;
      const params = [product_id];
      await connection.query(query, params);
      return { message: "Product deleted successfully" };
    } finally {
      connection.release();
    }
  }
  static async deleteOrderByProductId(product_id){
    const connection = await db.getConnection();
    try {
      const query = `DELETE orders
        FROM orders 
        WHERE orders.product_id = ?;
        `;
      const params = [product_id];
      await connection.query(query, params);
      return { message: "Product deleted successfully" };
    } finally {
      connection.release();
    }
  }
  static async deleteProduct(id) {
    const connection = await db.getConnection();
    try {
      const query = "DELETE FROM products WHERE id = ?";
      const params = [id];
      await connection.query(query, params);
      return { message: "Product deleted successfully" };
    } finally {
      connection.release();
    }
  }
  static async getProduct(id, name, typeId, soft) {
    const connection = await db.getConnection();
    try {
        let query = `SELECT products.id AS product_id, products.name AS name, 
        product_size.size AS size, product_size.unit AS unit, 
        product_color.color AS color, products.price, 
        discounts.rate AS discount, products.imgName,products.type_id AS type_id,
        brands.name AS brand, product_type.name AS type,products.description AS description
        FROM products 
        JOIN brands ON products.brand_id = brands.id 
        JOIN product_type ON products.type_id = product_type.id 
        JOIN product_size ON products.size_id = product_size.id 
        JOIN product_color ON products.color_id = product_color.id 
        JOIN discounts ON discounts.id = products.discount_id`;
        
        let conditions = [];
        let params = [];

        if (id !== undefined && id !== null && id !== "") {
            conditions.push("products.id = ?");
            params.push(id);
        }
        if (name !== undefined && name !== null && name !== "") {
            conditions.push("products.name LIKE ?");
            params.push(`%${name}%`); 
        }
        if (typeId !== undefined && typeId !== null && typeId !== "") {
            conditions.push("products.type_id = ?");
            params.push(typeId);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" OR "); 
        }
        
        switch (soft) {
            case "idUp":
                query += " ORDER BY products.id ASC";
                break;
            case "idDown":
                query += " ORDER BY products.id DESC";
                break;
            case "priceUp":
                query += " ORDER BY products.price ASC";
                break;
            case "priceDown":
                query += " ORDER BY products.price DESC";
                break;
            case "nameUp":
                query += " ORDER BY products.name ASC";
                break;
            case "nameDown":
                query += " ORDER BY products.name DESC";
                break;
            case "typeUp":
                query += " ORDER BY products.type_id ASC";
                break;
            case "typeDown":
                query += " ORDER BY products.type_id DESC";
                break;
            default:
                query += " ORDER BY products.id"; 
                break;
        }
        // console.log(query);
        const [result] = await connection.query(query, params);

        // Chuyển đổi dữ liệu truy vấn thành danh sách `ProductModel`
        const products = result.map(row => new ProductModel(
            row.product_id,
            row.name,
            row.size,
            row.unit,
            row.color,
            row.price,
            row.discount,
            row.imgName,
            row.brand,
            row.type,
            row.description,
            row.type_id,
            []
        ));

        return products;
        } finally {
            connection.release();
        }
    }
    static async searchProductByKeyword(keyword) {
        const connection = await db.getConnection();
        try {
            let query = `
            SELECT products.id AS product_id, products.name AS name,
                product_size.size AS size, product_size.unit AS unit,
                product_color.color AS color, products.price,
                discounts.rate AS discount, products.imgName, products.type_id AS type_id,
                brands.name AS brand, product_type.name AS type, products.description AS description
            FROM products
            JOIN brands ON products.brand_id = brands.id
            JOIN product_type ON products.type_id = product_type.id
            JOIN product_size ON products.size_id = product_size.id
            JOIN product_color ON products.color_id = product_color.id
            JOIN discounts ON discounts.id = products.discount_id
            WHERE products.name LIKE ? OR product_type.name LIKE ? OR brands.name LIKE ?
            `;
    
            const [result] = await connection.query(query, [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]);
    
            return result.map(row => new ProductModel(
                row.product_id,
                row.name,
                row.size,
                row.unit,
                row.color,
                row.price,
                row.discount,
                row.imgName,
                row.brand,
                row.type,
                row.description,
                row.type_id
              )); // như bạn đã có
        } finally {
            connection.release();
        }
    }
    static async createProductImages(product_id, imgName) {
      const connection = await db.getConnection();
      try {
        const query = `INSERT INTO images (product_id, name) VALUES (?, ?)`;
        const [result] = await connection.query(query, [product_id, imgName]);
        return result.insertId;
      } catch (error) {
        console.error("Lỗi khi thêm ảnh sản phẩm:", error);
        throw error; // để controller biết có lỗi xảy ra
      } finally {
        connection.release(); // đảm bảo luôn giải phóng kết nối
      }
    }
    static async getProductImages(product_id){
      const connection = await db.getConnection();
      try {
        const query = `SELECT * FROM images WHERE product_id = ?`;
        const [result] = await connection.query(query, [product_id]);
        return result;
      } catch (error) {
        console.error("Lỗi khi lấy ảnh minh hoạ sản phẩm:", error);
        throw error; // để controller biết có lỗi xảy ra
      } finally {
        connection.release(); // đảm bảo luôn giải phóng kết nối
      }
    }
}

module.exports = ProductRepository;
