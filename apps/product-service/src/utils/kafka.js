import { kafkaClient,createConsumer,createProducer} from "@repo/kafka";

const kafkaclient = kafkaClient("product-service");

export const producer = createProducer(kafkaclient);
export const consumer = createConsumer(kafkaclient, "product-group");