import { createConsumer, createProducer, kafkaClient } from "@repo/kafka";

const kafkaclient = kafkaClient("payment-service");

export const producer = createProducer(kafkaclient);
export const consumer = createConsumer(kafkaclient, "payment-group");