import express from 'express'
import cors from 'cors'

import cookieParser from "cookie-parser";
import { connectProducer } from './services/kafka/producer';
import { runPaymentConsumer } from './services/kafka/paymentConsumer.js';
import { runStockConsumer } from './services/kafka/stockConsumer.js';
import routes from './routes/main';
import path from 'path';

const server = express()
server.use(cors({
  origin: process.env.FRONT_URL, 
  credentials: true, 
}));
server.use("/products", express.static(path.join(__dirname, "../../../../", "public", "products")));
server.use(express.json())
server.use(cookieParser())

server.use(routes)


server.listen(4000, async () => {
    
    console.log("Foi!");

    await connectProducer()
    await runPaymentConsumer();
    await runStockConsumer()
})