const express = require("express");
const router = express.Router();
const ProductInforController = require("../controllers/productInforController");

router.get("/sizes", ProductInforController.getSizes);
router.get("/colors", ProductInforController.getColors);
router.get("/brands", ProductInforController.getBrands);
router.get("/discounts", ProductInforController.getDiscounts);
router.get("/types", ProductInforController.getTypes);
router.post("/types", ProductInforController.addsTypes);

router.post("/colors",ProductInforController.addColor);
router.post("/sizes",ProductInforController.addSize);
module.exports = router;
