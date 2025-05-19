const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");
const { authorize } = require("../middlewares/authorizeMiddleware");
const { authenticateToken } = require("../middlewares/authMiddleware");
const ProductController = require("../controllers/productController")
router.put("/ban/:id",authenticateToken,authorize("Admin"),AdminController.UpdateUserState);
router.put("/add_product/:product_id",authenticateToken,authorize("Admin"),ProductController.addProductStorage);
module.exports = router;