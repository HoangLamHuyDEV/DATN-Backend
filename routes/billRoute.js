const express = require("express");
const router = express.Router();
const billController = require("../controllers/BillController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/authorizeMiddleware");
const pdfController = require('../controllers/PDFController');

router.post('/invoice', async (req, res) => {
    const billInfo = req.body; // client gửi đầy đủ data hoá đơn lên
    // console.log(billInfo);
    await pdfController.generateInvoicePdf(billInfo, res);
  });
  

router.get("/:id",authenticateToken,authorize("Admin,Employee"),billController.GetBillById);
module.exports = router;