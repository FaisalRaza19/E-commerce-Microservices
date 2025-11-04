import {createConsumer, createProducer,kafkaClient} from "@repo/kafka/src/index.js";

const kafkaclient = kafkaClient("order-service");

export const producer = createProducer(kafkaclient);
export const consumer = createConsumer(kafkaclient, "order-group");