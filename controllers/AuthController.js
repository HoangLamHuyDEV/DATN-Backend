const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const ReturnResponseUtil = require("../utils/returnResponse");
const UserAccountRepository = require("../repositories/userRepository");
const nodemailer = require("nodemailer");
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || "your_jwt_secret_key";
const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL,
          pass: process.env.G_PASS
        }
      });
class AuthController {
  static async Login(req, res) {
    try {
      const { username, password } = req.body;

      // Lấy user theo username
      const user = await UserAccountRepository.getUserByUsername(username);

      if (!user || user.length === 0) {
        return ReturnResponseUtil.returnResponse(res, 404, false, "Tên đăng nhập không tồn tại");
      }
      
      // So sánh mật khẩu với bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return ReturnResponseUtil.returnResponse(res, 401, false, "Mật khẩu không đúng");
      }

      // Tạo JWT
      const payload = {
        id: user.id,
        username: user.username,
        role: user.role
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

      return ReturnResponseUtil.returnResponse(res, 200, true, "Đăng nhập thành công", {
        access_token: token
      });

    } catch (error) {
      console.error("Login error:", error);
      return ReturnResponseUtil.returnResponse(res, 500, false, "Lỗi máy chủ");
    }
  }

  static async Signup(req, res) {
    try {
      const { username, email, password } = req.body;

      // 1. Kiểm tra ký tự đặc biệt trong username
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: "Tên tài khoản không được chứa ký tự đặc biệt." });
      }

      // 2. Kiểm tra định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Email không hợp lệ." });
      }
      if (password.length < 8) {
        return res.status(400).json({ message: "Mật khẩu phải có ít nhất 8 ký tự." });
      }
      // 3. Kiểm tra username đã tồn tại chưa
      const existingUser = await UserAccountRepository.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Tên tài khoản đã tồn tại." });
      }
      const existingEmail = await UserAccountRepository.getUserByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ message: "Mỗi email chỉ có thể đăng ký một tài khoản." });
      }
      // 4. Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10); // saltRounds = 10

      // 5. Tạo user + user info
      const result = await UserAccountRepository.createUser(username, email, hashedPassword);
      const resultInfo = await UserAccountRepository.createUserInfo(result.insertId);

      if (result.success && resultInfo.message === "Successfully") {
        return res.status(201).json({ message: result.message });
      } else {
        return res.status(400).json({ message: result.message });
      }
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ message: "Đã xảy ra lỗi", error: error.message });
    }
  }
  static async ResetPassword(req, res) {
    try {
      const { username } = req.body;

      const acc = await UserAccountRepository.getUserByUsername(username);

      if (!acc || acc.length === 0) {
        return ReturnResponseUtil.returnResponse(res, 404, false, "Tên đăng nhập không tồn tại");
      }

      const user = acc;

      const newPassword = crypto.randomBytes(4).toString("hex"); // 8 ký tự ngẫu nhiên
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await UserAccountRepository.updatePassword(user.id, hashedPassword);

      // Gửi mật khẩu mới đến email
      await transporter.sendMail({
        from: '"HTC Support" <your_email@gmail.com>',
        to: user.email,
        subject: "Mật khẩu mới của bạn",
        html: `<p>Chào <b>${user.username}</b>,</p>
               <p>Mật khẩu mới của bạn là: <b>${newPassword}</b></p>
               <p>Vui lòng đăng nhập và thay đổi mật khẩu ngay sau khi đăng nhập lại.</p>
               <p>Trân trọng,<br>HTC Team</p>`
      });

      return ReturnResponseUtil.returnResponse(res, 200, true, "Đặt lại mật khẩu thành công. Vui lòng kiểm tra email.");
    } catch (error) {
      console.error("ResetPassword error:", error);
      return ReturnResponseUtil.returnResponse(res, 500, false, "Lỗi máy chủ");
    }
  }
}

module.exports = AuthController;
