import { consumer } from "./kafka.js";
import { createStripeProduct, deleteStripeProduct } from "./stripeProduct.js";

export const runKafkaSubscriptions = async () => {
    consumer.subscribe([
        {
            topicName: "product.created",
            topicHandler: async (message) => {
                console.log("product message",message)
                if (!message) {
                    console.error("Received invalid product.created message:", message);
                    return;
                }
                const product = message;
                console.log("Received message: product.created", product);

                await createStripeProduct(product);
            },
        },
        {
            topicName: "product.deleted",
            topicHandler: async (message) => {
                if (!message) {
                    console.error("Received invalid product.deleted message", message);
                    return;
                }
                const productId = message;
                console.log("Received message: product.deleted", productId);
                await deleteStripeProduct(productId);
            },
        },
    ]);
};
