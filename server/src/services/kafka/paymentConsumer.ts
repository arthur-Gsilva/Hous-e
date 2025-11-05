import { Kafka } from "kafkajs";
import { publishEvent } from "./producer.js";
import logger from "../../logger.js";

const kafka = new Kafka({
	clientId: "payment-consumer",
	brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "payment-group" });

export async function runPaymentConsumer() {
	await consumer.connect();
	await consumer.subscribe({ topic: "order-created", fromBeginning: false });

	logger.info("Servço de pagamento ativo!");

	await consumer.run({
		eachMessage: async ({ message }) => {
			const data = JSON.parse(message.value?.toString() || "{}");
			logger.info(`Processndo pagamento de ${data.orderId}`);

		},
	});
}
