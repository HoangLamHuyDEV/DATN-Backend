const jwt = require("jsonwebtoken");
const ReturnResponseUtil = require("../utils/returnResponse");

async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return ReturnResponseUtil.returnResponse(res, 401, false, `Unauthorized`);
  }
  
  const token = authHeader.split(" ")[1];

  // Xác minh token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return ReturnResponseUtil.returnResponse(res, 403, false, "Token không hợp lệ hoặc đã hết hạn");
    }
    // console.log(user.id);
    req.user = user; // Gán thông tin người dùng vào req.user
    // console.log(user);
    next(); // Tiếp tục với request
  });
}

module.exports = { authenticateToken };
