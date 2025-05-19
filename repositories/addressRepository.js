const db = require("../configs/db");

class AddressRepository {
  static async GetAllProvines() {
    const connection = await db.getConnection();
    try {
      const [rows] = await connection.query("SELECT * FROM provinces");
      return rows;
    } finally {
      connection.release();
    }
  }

  static async GetAllDistrictsByProvinceId(province_id) {
    const connection = await db.getConnection();
    try {
      const [rows] = await connection.query(
        "SELECT * FROM districts WHERE province_id = ?",
        [province_id]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  static async GetAllWardByDistrictId(district_id) {
    const connection = await db.getConnection();
    try {
      const [rows] = await connection.query(
        "SELECT * FROM wards WHERE district_id = ?",
        [district_id]
      );
      return rows;
    } finally {
      connection.release();
    }
  }
}

module.exports = AddressRepository;
