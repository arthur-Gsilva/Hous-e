import { Kafka, logLevel } from 'kafkajs'

const KAFKA_BROKER_ADDRESS = process.env.KAFKA_BROKER || 'localhost:9092'
const EXAMPLE_TOPIC = 'example-topic'

const kafka = new Kafka({
  brokers: [KAFKA_BROKER_ADDRESS],
  logLevel: logLevel.ERROR,
})

const consumer = kafka.consumer({ groupId: 'example-consumer' })

export async function runConsumer() {
  await consumer.connect()
  await consumer.subscribe({ topic: EXAMPLE_TOPIC })

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log({
        key: message.key?.toString(),
        value: message.value?.toString(),
        offset: message.offset,
      })
    },
  })
}
