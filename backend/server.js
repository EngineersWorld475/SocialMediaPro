import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connedDB.js';
const app = express();
dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(5000, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
