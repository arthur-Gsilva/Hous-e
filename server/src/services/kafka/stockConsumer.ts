import { Kafka } from "kafkajs";
import logger from "../../logger.js";
import { prisma } from "../../libs/prisma.js";
import { publishEvent } from "./producer.js";
import { getOneProduct } from "../products.js";

const kafka = new Kafka({
    clientId: "stock-consumer",
    brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "stock-group" });

export async function runStockConsumer() {
    await consumer.connect();
    await consumer.subscribe({ topic: "payment-confirmed", fromBeginning: false });

    logger.info("Serviço de estoque conectado");

    await consumer.run({
        eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value?.toString() || "{}");
        logger.info(`Verificando estoque do pedido ${data.orderId}`);

        const order = await prisma.order.findUnique({
            where: { id: data.orderId },
            include: { orderItems: true },
        });

        if (!order) {
            logger.error(`Pedido ${data.orderId} não encontrado`);
            return;
        }

        let hasStock = true;
        for (const item of order.orderItems) {
                const product = await getOneProduct(item.productId);
                if (!product || product.stock < item.quantity) {
                    hasStock = false;
                    break;
                }
        }

        if (hasStock) {
            logger.info(`estoque confirmado para venda ${data.orderId}`);

            for (const item of order.orderItems) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity, 
                        },
                        salesCount: { increment: 1 }
                    },
                });
            }

            await prisma.order.update({
                where: { id: order.id },
                data: { status: "CONFIRMED" },
            });

            await publishEvent("order-confirmed", {
                orderId: order.id,
                status: "CONFIRMED",
            });
        } else {
            logger.info(`Estoque insuficiente para${data.orderId}`);

            await prisma.order.update({
                where: { id: order.id },
                data: { status: "CANCELLED" },
            });

            await publishEvent("order-cancelled", {
                orderId: order.id,
                status: "CANCELLED",
            });
        }
        },
    });
}
