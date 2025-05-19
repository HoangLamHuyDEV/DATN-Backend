const db = require("../configs/db");

class BillRepository{
    static async GetBillById(id){
        const query = `SELECT * FROM bills WHERE id=?`;
        const params = [id];
        const result = await db.query(query, params);
        return result[0];
    }
}
module.exports = BillRepository;