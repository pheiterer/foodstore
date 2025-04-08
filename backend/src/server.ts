import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import foodRouter from './routers/food.router'
import userRouter from './routers/user.router'
import { dbConnect } from './config/database.config';

dbConnect();
const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const corsOptions = {
  origin: ['http://localhost:4200', 'http://192.168.100.11:4200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/foods", foodRouter);
app.use("/api/users", userRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
