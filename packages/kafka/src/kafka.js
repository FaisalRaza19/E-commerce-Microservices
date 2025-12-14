import { Kafka, logLevel } from "kafkajs";

export const kafkaClient = (serviceName) => {
  if (!serviceName) {
    throw new Error("A serviceName (clientId) must be provided for Kafka client.");
  }
  const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(",") : ["localhost:9092", "localhost:9093", "localhost:9094"];

  return new Kafka({
    clientId: serviceName,
    brokers,
    connectionTimeout: 10000,
    retry: {
      initialRetryTime: 300,
      retries: 10,
    },
    logLevel: logLevel.WARN,
  });
};
