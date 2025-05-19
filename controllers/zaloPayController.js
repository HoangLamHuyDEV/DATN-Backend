const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const qs = require('qs'); // ✅ Để stringify dạng x-www-form-urlencoded
const router = express.Router();

const config = {
    app_id: "2553",
    key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create",
    redirect_url: "http://localhost:3000/cart"
};


// Tạo đơn hàng ZaloPay
router.post('/create-zalopay-order', async (req, res) => {
    try {
        const { amount, description, user_id } = req.body;
        console.log(amount,description,user_id)
        const embed_data = {
            redirecturl: config.redirect_url,
            user_id
        };

        const transID = Date.now(); // ID duy nhất
        const order = {
            app_id: config.app_id,
            app_trans_id: `${new Date().toISOString().slice(2, 10).replace(/-/g, '')}_${transID}`,
            app_user: user_id || 'guest',
            app_time: Date.now(),
            amount,
            item: JSON.stringify([]),
            description: description || `Thanh toán đơn hàng #${transID}`,
            embed_data: JSON.stringify(embed_data),
            bank_code: '',
            callback_url: config.callback_url
        };

        // ✅ Tạo chữ ký
        const data =
            `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
        order.mac = crypto.createHmac('sha256', config.key1).update(data).digest('hex');
        console.log("Signing data:", data);

        // ✅ Gửi request đến ZaloPay đúng định dạng
        const response = await axios.post(
            config.endpoint,
            qs.stringify(order),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        console.log('ZaloPay response:', response.data);

        res.json({
            success: true,
            order_url: response.data.order_url,
            zp_trans_token: response.data.zp_trans_token,
            app_trans_id: order.app_trans_id
        });

    } catch (err) {
        console.error('❌ Lỗi khi tạo đơn hàng ZaloPay:', err?.response?.data || err.message);
        res.status(500).json({ success: false, message: 'Tạo đơn hàng thất bại', error: err?.response?.data });
    }
});

module.exports = router;
