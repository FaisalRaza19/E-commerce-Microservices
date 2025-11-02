import {createConsumer, createProducer,kafkaClient} from "@repo/kafka";

const kafkaclient = kafkaClient("order-service");

export const producer = createProducer(kafkaclient);
export const consumer = createConsumer(kafkaclient, "order-group");