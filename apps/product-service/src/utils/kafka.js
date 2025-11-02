import {createProducer, kafkaClient} from "@repo/kafka";

const kafkaclient = kafkaClient("product-service");

export const producer = createProducer(kafkaclient);
// export const consumer = createConsumer(kafkaClient,"product-group")