const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authorize } = require("../middlewares/authorizeMiddleware");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/", authenticateToken,authorize("Admin,Employee"),productController.getAllProducts);
// router.get("/:id", productController.getProductById);
router.get("/soft",productController.searchProduct);
router.get("/search",productController.searchProductCtrl);
router.post("/",authenticateToken,authorize("Admin"), productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;