const UserRepository = require("../repositories/userRepository");
const bcrypt = require("bcrypt");
class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserRepository.getAllUsers();
      if (users.length > 0) {
        res.status(200).json({
          success: true,
          message: "Get All Users Successfully",
          data: users,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No users found",
        });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getUserById(req, res) {
    try {
      const id = req.user.id;
      //   console.log(id);
      const user = await UserRepository.getUserById(id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  // controllers/UserController.js
  static async createBill(req, res) {
    try {
      const userId = req.user?.id;
      const {name,phone_number, acc_order_id, status_id, receivingAddress, total_price, pay_method } = req.body;
        console.log(userId,name,phone_number, acc_order_id, status_id, receivingAddress, total_price, pay_method);
      // Kiểm tra các trường bắt buộc
      if (!acc_order_id || !status_id || !receivingAddress || !total_price || !pay_method) {
        return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });
      }
  
      // Kiểm tra xem người dùng có quyền tạo đơn hàng cho acc_order_id không
      const check = await UserRepository.checkAcc(userId, acc_order_id);
      console.log(check);
      if (!check) {
        return res.status(403).json({ message: "Không có quyền tạo đơn hàng cho tài khoản này." });
      }
  
      const create_date = new Date();
  
      const bill = await UserRepository.createBill({
        name,
        phone_number,
        status_id,
        create_date,
        acc_order_id,
        receivingAddress,
        total_price,
        pay_method
      });
  
      res.status(201).json(bill);
  
    } catch (err) {
      console.error("Lỗi khi tạo đơn hàng:", err);
      res.status(500).json({ error: "Lỗi server" });
    }
  }
  
  static async getUserBills(req, res) {
    try {
      const id = req.user.id;
      // console.log(id);
      const bills = await UserRepository.getUserBills(id);
      if (!bills) return res.status(404).json({ message: "User not found" });
      res.json(bills);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  static async createUser(req, res) {
    try {
      const { name, email, password } = req.body;
      const newUser = await UserRepository.createUser(name, email, password);
      res.json(newUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }



  static async updateUser(req, res) {
    try {
        // console.log("a")
      const userId = req.user.id;
      const { password, resetPassword } = req.body;
        // console.log(password,resetPassword)
      if (!password || !resetPassword) {
        return res.status(400).json({ message: "Thiếu mật khẩu cũ hoặc mới." });
      }
  
      const user = await UserRepository.getUserPassById(userId);
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng." });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu cũ không chính xác." });
      }
  
      const hashedPassword = await bcrypt.hash(resetPassword, 10);
      await UserRepository.updatePassword(userId, hashedPassword);
  
      res.json({ message: "Cập nhật mật khẩu thành công." });
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.log(err)
    }
  }
  
  static async updateUserInfo(req, res) {
    try {
      const id = req.user.id;
      const { name, phone_number, ward_id } = req.body;
      const updatedUser = await UserRepository.UpdateUserInfo(
        id,
        name,
        phone_number,
        ward_id
      );
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deletedUser = await UserRepository.deleteUser(id);
      res.json(deletedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = UserController;
