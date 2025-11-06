import { shouldBeAdmin, userAuth } from "../middleware/auth_middleware.js";
import {Order} from "@repo/order-db";
import { startOfMonth, subMonths } from "date-fns";

export const orderRoute = async (fastify) => {
    // Get all orders for a logged-in user
    fastify.get(
        "/user-orders",
        { preHandler: userAuth },
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
    fastify.get(
        "/order-chart",
        { preHandler: shouldBeAdmin },
        async (req, res) => {
            const now = new Date();
            const sixMonthsAgo = startOfMonth(subMonths(now, 5));

            // { month: "April", total: 173, successful: 100 }

            const raw = await Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: sixMonthsAgo, $lte: now },
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        total: { $sum: 1 },
                        successful: {
                            $sum: {
                                $cond: [{ $eq: ["$status", "success"] }, 1, 0],
                                // {
                                //   "year":2025,
                                //   "month":9,
                                //   "total":100,
                                //   "successful":72
                                // }
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        year: "$_id.year",
                        month: "$_id.month",
                        total: 1,
                        successful: 1,
                    },
                },
                {
                    $sort: { year: 1, month: 1 },
                },
            ]);

            const monthNames = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];

            const results = [];

            for (let i = 5; i >= 0; i--) {
                const d = subMonths(now, i);
                const year = d.getFullYear();
                const month = d.getMonth() + 1;

                const match = raw.find(
                    (item) => item.year === year && item.month === month
                );

                results.push({
                    month: monthNames[month - 1],
                    total: match ? match.total : 0,
                    successful: match ? match.successful : 0,
                });
            }

            return res.send(results);
        }
    );
};