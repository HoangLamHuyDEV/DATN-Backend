const billRepository = require("../repositories/billRepository");

class BillController{
    static async GetBillById(req,res){
        try {
            const  bill_id  = req.params.id;
          //   console.log(id);
            const order = await billRepository.GetBillById(bill_id);
            if (!order) return res.status(404).json({ message: "bill not found" });
            res.json(order);
          } catch (err) {
            res.status(500).json({ error: err.message });
          }
    }
}
module.exports =BillController;