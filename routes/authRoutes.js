const AuthController = require("../controllers/AuthController");
const router = require("express").Router();
const { authorize } = require("../middlewares/authorizeMiddleware");
const { authenticateToken } = require("../middlewares/authMiddleware");
const ActivationController = require("../controllers/ActivationController");       
router.post("/send-activation-code", authenticateToken, ActivationController.sendActivationCode);
router.post("/verify-activation-code", authenticateToken, ActivationController.verifyActivationCode);

// const rateLimit = require('express-rate-limit');
// const apiLimiter = rateLimit({
// 	windowMs: 10 * 1000, 
// 	limit: 5, 
// 	standardHeaders: 'draft-7',
// 	legacyHeaders: false,
// })


router.post("/login" ,AuthController.Login);   
router.post("/signup" ,AuthController.Signup);
router.post("/reset-password" ,AuthController.ResetPassword);
module.exports = router;
