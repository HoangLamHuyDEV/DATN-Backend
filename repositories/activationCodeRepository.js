const db = require("../configs/db"); // hoặc connection pool tùy bạn đang dùng

const ActivationCodeRepository = {
  async createCode(userId, code, expiresAt) {
    const sql = "INSERT INTO activation_codes (user_id, code, expires_at) VALUES (?, ?, ?)";
    await db.execute(sql, [userId, code, expiresAt]);
  },

  async getLatestCode(userId) {
    const [rows] = await db.execute(
      "SELECT * FROM activation_codes WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [userId]
    );
    return rows[0];
  },

  async deleteByUserId(userId) {
    await db.execute("DELETE FROM activation_codes WHERE user_id = ?", [userId]);
  }
};

module.exports = ActivationCodeRepository;
