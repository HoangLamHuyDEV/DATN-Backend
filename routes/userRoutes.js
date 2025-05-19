const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const AddressController = require("../utils/addressCotroller");


router.get("/",authenticateToken, UserController.getAllUsers);
router.get("/me", authenticateToken,UserController.getUserById);
router.get("/bills", authenticateToken,UserController.getUserBills);
router.post("/bills", authenticateToken,UserController.createBill);
router.put("/me", authenticateToken,UserController.updateUserInfo);
router.post("/", UserController.createUser);
router.put("/change-password",authenticateToken, UserController.updateUser);
router.delete("/:id", UserController.deleteUser);
router.get("/wards/:district_id",AddressController.getWardsByDistrictId);
router.get("/districts/:province_id",AddressController.getDistrictsByProvinceId);
router.get("/provinces",AddressController.getAllProvines);
module.exports = router;
