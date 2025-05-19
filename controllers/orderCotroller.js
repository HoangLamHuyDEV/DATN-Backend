const OrderRepository = require("../repositories/orderRepository");

class OrderController {
  static async getAllOrders(req, res) {
    try {
      const orders = await OrderRepository.getAllOrders();
      if (orders.length > 0) {
        res.status(200).json({
          success: true,
          message: "Get All Orders Successfully",
          data: orders,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No records found at the moment",
        });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getAccountOrder(req, res) {
    try {
      const  id  = req.user.id;
    //   console.log(id);
      const order = await OrderRepository.GetAccountOders(id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createOrder(req, res) {
    try {
      const { product_id, total_price, amount } = req.body;
      const id = req.user.id;
    //   console.log(product_id,total_price,amount);
      const check = await OrderRepository.checkOrderExsit(id,product_id);
      if(check){
        const updateOrderResult = await OrderRepository.updateOrder(product_id,id,total_price,amount);
        res.json(updateOrderResult);
      }else{    
        const newOrder = await OrderRepository.createOrder(product_id, total_price, amount);
        const newAccOrder =  await OrderRepository.createAccOrder(id,newOrder);
        res.json(newAccOrder);
      }
      
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.log(err);
    }
  }


  static async updateOrder(req, res) {
    try {
      const { id } = req.params;
      const { user_id, total_price, status } = req.body;
      const updatedOrder = await OrderRepository.updateOrder(id, user_id, total_price, status);
      res.json(updatedOrder);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const deletedOrder = await OrderRepository.deleteOrder(id);
      res.json(deletedOrder);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = OrderController;
