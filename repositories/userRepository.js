const db = require("../configs/db");

class UserRepository {
    // repositories/UserRepository.js

    static async createBill({ name,phone_number,status_id, create_date, acc_order_id, receivingAddress, total_price ,pay_method}) {

        const query = "INSERT INTO `bills` ( `name`,`phone_number`,`status_id`, `create_date`, `acc_order_id`, `receivingAddress`, `total_price`, `pay_method`) VALUES (?,?,?,?,?,?,?,?)";
        const result = await db.query(query, [name,phone_number,status_id, create_date, acc_order_id, receivingAddress, total_price ,pay_method]);
        return { message: "Successfully" ,
            id: result.insertId
        };
    }
    static async updatePassword(id, hashedPassword){
        const query =
      "UPDATE accounts SET password = ? WHERE id = ?";
    await db.query(query, [hashedPassword, id]);
    return { message: "User updated successfully" };
    }

    static async checkAcc(acc_id, acc_order_id) {
        const [rows] = await db.query(
            `SELECT account_id FROM account_oders WHERE id = ?`,
            [acc_order_id]
        );
    
        if (rows.length > 0 && rows[0].account_id == acc_id) {
            return true;
        } else {
            return false;
        }
    }
    
  static async getAllUsers() {
    const [rows] =
      await db.query(`SELECT accounts.id, accounts.username,accounts.password, 
        status.state,email,roles.name AS role,users.name,users.phone_number,wards.name AS ward,districts.name AS district,provinces.name AS province
        FROM accounts JOIN users ON accounts.id = users.acc_id 
        JOIN status ON accounts.status_id = status.id
        JOIN roles ON roles.id = accounts.role_id 
        JOIN wards ON users.ward_id = wards.id 
        JOIN districts ON wards.district_id = districts.id 
        JOIN provinces ON districts.province_id = provinces.id`);
    return rows;
  }
  static async updateUserState(id, state) {
    const query = "UPDATE accounts SET status_id = ? WHERE id = ?";
    const [result] = await db.query(query, [state, id]);
    return result[0];
  }
  static async getUserBills(id){
    const query =  `SELECT bills.id, bills.create_date,bills.receivingAddress,bills.total_price 
    FROM bills JOIN account_oders ON bills.acc_order_id = account_oders.id
    WHERE account_id = ?`
    const [result] = await db.query(query,  id);
    return result;
  }
  static async getUserByUsername(username) {
    const query = "SELECT accounts.id, username,password,roles.name AS role,email FROM accounts JOIN roles ON accounts.role_id = roles.id WHERE username = ?";
    const [result] = await db.query(query, [username]);
    return result[0];
  }
  static async getUserByEmail(email) {
    const query = "SELECT accounts.id, username,password,roles.name AS role FROM accounts JOIN roles ON accounts.role_id = roles.id WHERE email = ?";
    const [result] = await db.query(query, [email]);
    return result[0];
  }
  static async getUserById(id) {
    const query = `SELECT accounts.username, 
        status.state,email,roles.name AS role,users.name,users.phone_number,wards.name AS ward,districts.name AS district,provinces.name AS province
        FROM accounts JOIN users ON accounts.id = users.acc_id 
        JOIN status ON accounts.status_id = status.id
        JOIN roles ON roles.id = accounts.role_id 
        JOIN wards ON users.ward_id = wards.id 
        JOIN districts ON wards.district_id = districts.id 
        JOIN provinces ON districts.province_id = provinces.id WHERE accounts.id = ?`;
    const [result] = await db.query(query, [id]);
    return result[0];
  }
  static async getUserPassById(id) {
    const query = `SELECT password FROM accounts WHERE accounts.id = ?`;
    const [result] = await db.query(query, [id]);
    return result[0];
  }

  static async createUser(name, email, password) {
    try {
      const query =
        "INSERT INTO accounts (username, email, password, role_id, status_id) VALUES (?, ?, ?, 2, 4)";
      const [result] = await db.query(query, [name, email, password]);

      return {
        success: true,
        message: "User inserted successfully",
        insertId: result.insertId,
      };
    } catch (error) {
      // Trường hợp tài khoản hoặc email bị trùng chẳng hạn
      console.error("createUser error:", error);
      return {
        success: false,
        message:
          "Tạo tài khoản thất bại. Tên đăng nhập hoặc email có thể đã tồn tại.",
      };
    }
  }
  static async createUserInfo(id) {
    const query = `INSERT INTO users (acc_id,ward_id) VALUES (?,1)`;
    await db.query(query, [id]);
    return { message: "Successfully" };
  }

  static async updateUser(id, password) {
    const query =
      "UPDATE users SET password = ? WHERE id = ?";
    await db.query(query, [ password, id]);
    return { message: "User updated successfully" };
  }

  static async deleteUser(id) {
    const query = "DELETE FROM users WHERE id = ?";
    await db.query(query, [id]);
    return { message: "User deleted successfully" };
  }
  static async GetAccountToken(account_id) {
    const query = `SELECT accounts.id, roles.name as role_name FROM accounts JOIN roles ON accounts.role_id = roles.id WHERE accounts.id = ?`;
    const params = [account_id];
    const result = await db.query(query, params);

    if (result.length > 0) {
      if (result[0].role_name == "admin") {
        const account = new AdminSystemAccountTokenModel(
          result[0].id,
          result[0].role_name
        );
        return account;
      }
      if (result[0].role_name == "user") {
        const account = new StudentAccountTokenModel(
          result[0].id,
          result[0].role_name
        );
        return account;
      }
    }
    return null;
  }
  static async UpdateUserInfo(id,name,phone_number,ward_id){
    const query =
      `UPDATE users  SET name = ?, phone_number = ?, ward_id = ? WHERE acc_id = ?`;
      await db.query(query, [name,phone_number,ward_id, id]);
      return { message: "User updated successfully" };
  }
  
}

module.exports = UserRepository;
