import { shouldBeAdmin, userAuth } from "../middleware/auth_middleware.js";
import { Order } from "@repo/order-db";

export const orderRoute = async (fastify) => {
    // Get all orders for a logged-in user
    fastify.get(
        "/user-orders",
        { preHandler: userAuth},
        async (req, res) => {
            const orders = await Order.find({ userId: req.userId });
            return res.send(orders);
        }
    );

    // Get all orders (admin only)
    fastify.get(
        "/orders",
        { preHandler: shouldBeAdmin },
        async (req, res) => {
            const { limit } = req.query;
            const orders = await Order.find()
                .limit(Number(limit) || 0)
                .sort({ createdAt: -1 });
            return res.send(orders);
        }
    );
};
