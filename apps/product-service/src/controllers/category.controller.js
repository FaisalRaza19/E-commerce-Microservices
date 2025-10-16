import { Prisma, prisma } from "@repo/db";

export const createCategory = async (req, res) => {
    try {
        const data = req.body;
        const category = await prisma.category.create({ data });
        res.status(201).json(category);
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const category = await prisma.category.update({
            where: { id: Number(id) },
            data,
        });

        res.status(200).json(category);
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await prisma.category.delete({
            where: { id: Number(id) },
        });

        res.status(200).json(category);
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
