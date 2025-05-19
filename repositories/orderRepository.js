const db = require("../configs/db");

class OrderRepository {
  static async getAllOrders() {
    const [rows] = await db.query(`SELECT 
    bills.id AS billId,
    users.name AS fullname, 
    SUM(orders.total_price) AS total_price_sum,
    bills.create_date,
    status.state 
    FROM bills
    JOIN account_oders ON account_oders.id = bills.acc_order_id
    JOIN orders ON account_oders.order_id = orders.id
    JOIN accounts ON accounts.id = account_oders.account_id
    JOIN users ON users.acc_id = accounts.id
    JOIN status ON status.id = bills.status_id
    GROUP BY bills.id, users.name
`);
    return rows;
  }

  static async GetAccountOders(acc_id) {
    const query = `SELECT  account_oders.id AS acc_order_id,products.id AS product_id,products.price AS unit_price,products.name AS product_name,imgName,orders.amount AS amount,orders.total_price
    FROM products JOIN orders ON products.id = orders.product_id
    JOIN account_oders ON orders.id = account_oders.order_id
    JOIN accounts ON account_oders.account_id = accounts.id
    WHERE accounts.id = ?
    `;
    const params = [acc_id];
    const result = await db.query(query, params);
    return result[0];
  }

  static async createOrder(product_id, total_price, amount) {
    const query =
      "INSERT INTO orders (product_id, total_price, amount) VALUES (?, ?, ?)";
    const [result] = await db.query(query, [product_id, total_price, amount]);
    return result.insertId;
  }
  static async createAccOrder(acc_id, order_id) {
    const query = `INSERT INTO account_oders (account_id,order_id) VALUES(?,?)`;
    const [result] = await db.query(query, [acc_id, order_id]);
    return result[0];
  }
  static async checkOrderExsit(acc_id, product_id) {
    const query = `SELECT * FROM account_oders JOIN orders ON account_oders.order_id = orders.id WHERE account_id = ? AND product_id =?`;
    const [result] = await db.query(query, [acc_id, product_id]);
    if (result.length == 0) {
      return false;
    } else {
      return true;
    }
  }
  static async updateOrder(product_id, acc_id, total_price, amount) {
    const query =
      "UPDATE orders JOIN account_oders ON account_oders.order_id = orders.id SET  total_price = ?, amount = ? WHERE product_id = ? AND account_id =?";
    await db.query(query, [total_price, amount, product_id, acc_id]);
    return { message: "Order updated successfully" };
  }

  static async deleteOrder(id) {
    const query = "DELETE FROM orders WHERE id = ?";
    await db.query(query, [id]);
    return { message: "Order deleted successfully" };
  }
}

module.exports = OrderRepository;
