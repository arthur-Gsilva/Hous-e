import { Kafka } from "kafkajs";
import logger from "../../logger.js";
import { prisma } from "../../libs/prisma.js";

const kafka = new Kafka({
    clientId: "stock-consumer",
    brokers: ["localhost:9092"],
});

type data = {
    query: string,
    userId: number
}

const consumer = kafka.consumer({ groupId: "search-group" });


export const runSearchConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "searched", fromBeginning: false });

    logger.info("Serviço de busca conectado");

    await consumer.run({
        eachMessage: async ({ message }) => {
            const data: data = JSON.parse(message.value?.toString() || "{}");

            if(data.query.length > 2){
                await prisma.search.create({
                    data: {
                        query: data.query,
                        userId: data.userId,
                        converted: false
                    }
                })

                logger.info("Query captada!")
            } else{
                logger.info("query muito curta.")
            }
        }
    })
}