import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connedDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoute.js';
import { v2 as cloudinary } from 'cloudinary';

const app = express();
dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

app.use(express.json({ limit: '50mb' })); // to parse json data in the req.body
app.use(express.urlencoded({ extended: true })); // to parse the form data in the req.body
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.listen(5000, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
