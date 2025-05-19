const productRepository = require("../repositories/productRepository");
const moment = require("moment");
const {upload, ImageController } = require("../utils/imageController");
class ProductController {
  static async getAllProducts(req, res) {
    try {
      const products = await productRepository.getAllProducts();
      if (products.length > 0) {
        res.status(200).json({
          success: true,
          message: "Get All Products Successfully",
          data: products,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No records found at the moment",
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await productRepository.getProductById(id);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createProduct(req, res) {
    try {
      const {
        name,
        price,
        description,
        type_id,
        imgName,
        brand_id,
        size_id,
        color_id,
        discount_id
      } = req.body;
      const product_images = req.body.productImages;
      const newProduct = await productRepository.createProduct(
        name,
        price,
        description,
        type_id,
        imgName,
        brand_id,
        size_id,
        color_id,
        discount_id
      );
      // console.log(product_images);
      if (product_images != null) {
        for (const img of product_images) {
          await productRepository.createProductImages(newProduct.id, img);
        }
      }      
      const importDate = moment().format("YYYY-MM-DD");
      const result = await productRepository.createProductStorage(newProduct.id, importDate);
      if(result!=null){
      res.status(201).json({
        success: true,
        message: "Thêm sản phẩm thành công",
        data: newProduct
      });}
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm:", err);
      res.status(500).json({
        success: false,
        message: "Lỗi server",
        error: err.message
      });
    }
  }


  static async addProductStorage(req, res) {
    try {
        const product_id = req.params.product_id;
      const  add_amount  = req.body.add_amount;

      if (!product_id) {
        return res.status(400).json({ success: false, message: "Thiếu product_id" });
      }

      const importDate = moment().format("YYYY-MM-DD");
    //   console.log("id:"+product_id)
      const result = await productRepository.addProductStorage(product_id, add_amount,importDate);

      return res.status(201).json({
        success: true,
        message: "Thêm sản phẩm thành công",
        data: result
      });
    } catch (error) {
      console.error("Lỗi khi tạo kho sản phẩm:", error);
      return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
  }

  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, price, description } = req.body;
      const updatedProduct = await productRepository.updateProduct(id, name, price, description);
      res.json(updatedProduct);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const imgName = req.body.imgName;
      await productRepository.deleteAccOrderByProductId(id);
      await productRepository.deleteOrderByProductId(id);
      await productRepository.deleteProductStorage(id);
      await ImageController.deleteImage(imgName);
      const deletedProduct = await productRepository.deleteProduct(id);
      res.json(deletedProduct);
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.log(err)
    }
  }
  static async searchProduct(req, res) {
    try {
        const { id, name, type_id,soft } = req.query; // Lấy dữ liệu từ query params
        const products = await productRepository.getProduct(id, name, type_id,soft);
        if(id!=null){
          products[0].productImages = await productRepository.getProductImages(id);
          // console.log( products.productImages)
        }
        
        res.json(products);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
   static async searchProductCtrl(req, res) {
        const keyword = req.query.keyword || '';
        // console.log(keyword)
        try {
            const products = await productRepository.searchProductByKeyword(keyword);
            res.status(200).json(products);
        } catch (err) {
            console.error('Lỗi tìm kiếm:', err);
            res.status(500).json({ error: 'Lỗi tìm kiếm sản phẩm' });
        }
    }
    
}

module.exports = ProductController;