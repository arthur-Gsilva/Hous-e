import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'house-application', // ID da sua aplicação
  brokers: ['localhost:9092'], // Endereços dos seus brokers Kafka
  // Adicione outras configurações como SSL, SASL se necessário
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'my-group-id' });