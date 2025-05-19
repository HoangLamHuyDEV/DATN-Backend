const UserRepository = require("../repositories/userRepository");

class AdminController{
    static async UpdateUserState(req,res){
        try {
            const  id  = req.params.id;
            const  state_id  = req.body.status_id;
            // console.log(id+" "+state_id);
            const updatedOrder = await UserRepository.updateUserState(id,state_id);
            res.json(updatedOrder);
          } catch (err) {
            res.status(500).json({ error: err.message });
          }
    }
}
module.exports = AdminController