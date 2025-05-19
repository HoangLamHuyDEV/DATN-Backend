// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const gptRouter= require("./routes/chatGptRoutes");
const app = express();
app.use(express.json());
app.use(cors());
const authRouter = require("./routes/authRoutes");
const productInforRoutes = require('./routes/productInfoRoutes');
const adminRoute = require('./routes/adminRoutes');
const billRoute = require("./routes/billRoute");
app.use("/api", authRouter);
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/images/", express.static("uploads"));
app.use('/api/product-infor', productInforRoutes);
app.use("/api/admin",adminRoute);
app.use("/api/chatbot",gptRouter);
app.use("/api/bills",billRoute);

// Import routes
const imageRoutes = require("./routes/imageRoutes");
app.use("/api/images", imageRoutes);
// server.js hoặc app.js
const zaloPayRoutes = require('./controllers/ZaloPayController');
// const { chatWithGPT } = require("./controllers/ChatGPTController");
app.use('/api/zalopay', zaloPayRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
