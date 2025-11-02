import { prisma, Prisma } from "@repo/product-database";
import { producer } from "../utils/kafka.js";

export const createProduct = async (req, res) => {
    try {
        const data = req.body;
        const { colors, images } = data;

        if (!colors || !Array.isArray(colors) || colors.length === 0) {
            return res.status(400).json({ message: "Colors array is required!" });
        }

        if (!images || typeof images !== "object") {
            return res.status(400).json({ message: "Images object is required!" });
        }

        const missingColors = colors.filter((color) => !(color in images));

        if (missingColors.length > 0) {
            return res
                .status(400)
                .json({ message: "Missing images for colors!", missingColors });
        }

        const product = await prisma.product.create({ data });
        console.log(product)

        const stripeProduct = {
            id: product.id.toString(),
            name: product.name,
            price: product.price,
        };

        await producer.send("product.created", stripeProduct);

        res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updatedProduct = await prisma.product.update({
            where: { id: Number(id) },
            data,
        });

        return res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await prisma.product.delete({
            where: { id: Number(id) },
        });

        await producer.send("product.deleted", Number(id));

        return res.status(200).json(deletedProduct);
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getProducts = async (req, res) => {
    try {
        const { sort, category, search, limit } = req.query;

        const orderBy = (() => {
            switch (sort) {
                case "asc":
                    return { price: Prisma.SortOrder.asc };
                case "desc":
                    return { price: Prisma.SortOrder.desc };
                case "oldest":
                    return { createdAt: Prisma.SortOrder.asc };
                default:
                    return { createdAt: Prisma.SortOrder.desc };
            }
        })();

        const products = await prisma.product.findMany({
            where: {
                category: category ? { slug: category } : undefined,
                name: search
                    ? {
                        contains: search,
                        mode: "insensitive",
                    }
                    : undefined,
            },
            orderBy,
            take: limit ? Number(limit) : undefined,
        });

        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
        });

        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
