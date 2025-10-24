// server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRoute from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import contactRouter from './routes/contactRoute.js';
import couponRoutes from "./routes/couponRoutes.js";
import otpRouter from './routes/otpRoute.js';
import testimonialRoute from "./routes/testimonialRoute.js";
import uploadRoute from "./routes/uploadRoute.js";

const app = express();
const port = process.env.PORT || 5000;

connectDB();
connectCloudinary();

app.use(express.json({ limit: '10mb' }));
app.use(cors());

// ✅ Routes
app.use('/api/user', userRoute);
app.use('/api/otp', otpRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/contact', contactRouter);
app.use("/api/coupons", couponRoutes);
app.use("/api/testimonials", testimonialRoute);
app.use("/api/upload", uploadRoute);

// Root
app.get('/', (req, res) => res.send('API Is Working Properly'));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
