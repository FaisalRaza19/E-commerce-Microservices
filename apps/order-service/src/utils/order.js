import { Order } from "@repo/order-db";
import { producer } from "./kafka.js";

export const createOrder = async (orderData) => {
    const newOrder = new Order(orderData);

    try {
        const order = await newOrder.save();

        const orderMessage = {
            email: order.email,
            amount: order.amount,
            status: order.status,
        };

        await producer.send("order.created", orderMessage);
    } catch (error) {
        console.log("Error creating or publishing order:", error);
        throw error;
    }
};
