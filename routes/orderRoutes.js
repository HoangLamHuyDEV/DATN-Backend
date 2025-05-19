const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderCotroller");
const { authorize } = require("../middlewares/authorizeMiddleware");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/",authenticateToken,authorize("Admin,Employee"), OrderController.getAllOrders);
router.post("/add",authenticateToken,OrderController.createOrder);
router.get("/me", authenticateToken,OrderController.getAccountOrder);

module.exports = router;
