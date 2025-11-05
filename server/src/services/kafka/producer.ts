import { Kafka } from "kafkajs";
import logger from "../../logger";

const kafka = new Kafka({
    clientId: "hous-e-producer",
    brokers: ["localhost:9092"],
});

const kafkaProducer = kafka.producer();
let isConnected = false;

export async function connectProducer() {
    if (!isConnected) {
        await kafkaProducer.connect();
        isConnected = true;
        logger.info("Kafka Producer conectado");
    }
}

export async function publishEvent(topic: string, message: unknown) {
    try {
        if (!isConnected) {
            logger.warn("Producer não conectado. Conectando...");
            await connectProducer();
        }

        await kafkaProducer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });

        logger.info(`Mensaagem no tópico: "${topic}"`);
    } catch (err: any) {
        logger.error("erro no kafka: ", err);
    }
}

export { kafkaProducer };
