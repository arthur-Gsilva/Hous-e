import { Kafka, logLevel } from 'kafkajs'

const KAFKA_BROKER_ADDRESS = process.env.KAFKA_BROKER || 'localhost:9092'
const EXAMPLE_TOPIC = 'example-topic'

const kafka = new Kafka({
  brokers: [KAFKA_BROKER_ADDRESS],
  logLevel: logLevel.ERROR,
})

export const producer = kafka.producer()

export async function sendMessage(key: string, value: string) {
  await producer.connect()
  await producer.send({
    topic: EXAMPLE_TOPIC,
    messages: [{ key, value }],
  })
  console.log(`Mensagem enviada: ${key} => ${value}`)
}
