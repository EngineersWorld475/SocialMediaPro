import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connedDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoute.js';

const app = express();
dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;
app.use(express.json()); // to parse json data in the req.body
app.use(express.urlencoded({ extended: true })); // to parse the form data in the req.body
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.listen(5000, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
