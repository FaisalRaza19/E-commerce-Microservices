import z from "zod"
export const CategoryFormSchema = z.object({
    name: z
        .string({ message: "Name is Required!" })
        .min(1, { message: "Name is Required!" }),
    slug: z
        .string({ message: "Slug is Required!" })
        .min(1, { message: "Slug is Required!" }),
});

export const colors = [
    "blue",
    "green",
    "red",
    "yellow",
    "purple",
    "orange",
    "pink",
    "brown",
    "gray",
    "black",
    "white",
];

export const sizes = [
    "xs",
    "s",
    "m",
    "l",
    "xl",
    "xxl",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
];

export const ProductFormSchema = z
    .object({
        name: z
            .string({ message: "Product name is required!" })
            .min(1, { message: "Product name is required!" }),
        shortDescription: z
            .string({ message: "Short description is required!" })
            .min(1, { message: "Short description is required!" })
            .max(60),
        description: z
            .string({ message: "Description is required!" })
            .min(1, { message: "Description is required!" }),
        price: z
            .number({ message: "Price is required!" })
            .min(1, { message: "Price is required!" }),
        categorySlug: z
            .string({ message: "Category is required!" })
            .min(1, { message: "Category is required!" }),
        sizes: z
            .array(z.enum(sizes))
            .min(1, { message: "At least one size is required!" }),
        colors: z
            .array(z.enum(colors))
            .min(1, { message: "At least one color is required!" }),
        images: z.record(z.string(), z.string(), {
            message: "Image for each color is required!",
        }),
    })
    .refine(
        (data) => {
            const missingImages = data.colors.filter(
                (color) => !data.images?.[color]
            );
            return missingImages.length === 0;
        },
        {
            message: "Image is required for each selected color!",
            path: ["images"],
        }
    );

export const UserFormSchema = z.object({
    firstName: z
        .string({ message: "First name is required!" })
        .min(2, { message: "First name must be at least 2 characters!" })
        .max(50),
    lastName: z
        .string({ message: "Last name is required!" })
        .min(2, { message: "Last name must be at least 2 characters!" })
        .max(50),
    username: z
        .string({ message: "Username is required!" })
        .min(2, { message: "Username must be at least 2 characters!" })
        .max(50),
    emailAddress: z.array(z.string({ message: "Email address is required!" })),
    password: z
        .string({ message: "Password is required!" })
        .min(8, { message: "Password must be at least 8 characters!" })
        .max(50),
});