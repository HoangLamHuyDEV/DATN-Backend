const nodemailer = require("nodemailer");
const moment = require("moment");
const UserAccountRepository = require("../repositories/userRepository");
const ActivationCodeRepository = require("../repositories/activationCodeRepository");
const ReturnResponseUtil = require("../utils/returnResponse");

class ActivationController {
  static async sendActivationCode(req, res) {
    try {
      const userId = req.user.id;
      const user = await UserAccountRepository.getUserById(userId);
    //   console.log(user);
      if (!user || user.state === "Kích hoạt") {
        return ReturnResponseUtil.returnResponse(res, 400, false, "Tài khoản đã kích hoạt hoặc không tồn tại");
      }

      // Tạo mã xác nhận và thời gian hết hạn
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = moment().add(10, "minutes").format("YYYY-MM-DD HH:mm:ss");

      // Lưu vào DB
      await ActivationCodeRepository.createCode(userId, code, expiresAt);

      // Gửi email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL,
          pass: process.env.G_PASS
        }
      });

      await transporter.sendMail({
        from: '"HTC Bắc Giang" <youremail@gmail.com>',
        to: user.email,
        subject: "Mã kích hoạt tài khoản",
        text: `Mã kích hoạt của bạn là: ${code}`
      });

      return ReturnResponseUtil.returnResponse(res, 200, true, "Đã gửi mã kích hoạt đến email");
    } catch (err) {
      console.error("Gửi mã kích hoạt lỗi:", err);
      return ReturnResponseUtil.returnResponse(res, 500, false, "Không thể gửi mã kích hoạt");
    }
  }

  static async verifyActivationCode(req, res) {
    try {
      const userId = req.user.id;
      const code = req.body.code;
      const saved = await ActivationCodeRepository.getLatestCode(userId);
      if (!saved) {
        return ReturnResponseUtil.returnResponse(res, 400, false, "Chưa gửi mã hoặc mã không tồn tại");
      }

      if (moment().isAfter(moment(saved.expires_at))) {
        await ActivationCodeRepository.deleteByUserId(userId);
        return ReturnResponseUtil.returnResponse(res, 400, false, "Mã đã hết hạn");
      }

      if (saved.code !== code) {
        return ReturnResponseUtil.returnResponse(res, 400, false, "Mã không hợp lệ");
      }

      // Kích hoạt tài khoản
      await UserAccountRepository.updateUserState(userId, 1);
      await ActivationCodeRepository.deleteByUserId(userId);

      return ReturnResponseUtil.returnResponse(res, 200, true, "Kích hoạt thành công");
    } catch (err) {
      console.error("Xác thực mã lỗi:", err);
      return ReturnResponseUtil.returnResponse(res, 500, false, "Lỗi máy chủ");
    }
  }
}

module.exports = ActivationController;
