import { kafkaClient, createProducer } from "@repo/kafka";

const kafka = kafkaClient("email-service");
export const producer = createProducer(kafka);