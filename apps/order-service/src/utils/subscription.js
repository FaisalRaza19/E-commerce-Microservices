import { consumer } from "./kafka.js";
import { createOrder } from "./order.js";

export const runKafkaSubscriptions = async () => {
  await consumer.subscribe([
    {
      topicName: "payment.successful",
      topicHandler: async (message) => {
        if (!message) {
          console.error("Received invalid payment", message);
          return;
        }
        const order = message;
        await createOrder(order);
      },
    },
  ]);
};
