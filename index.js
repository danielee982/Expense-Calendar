import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.create({
        data: { email: "test@example.com", name: "john doe"}
    });
    console.log("User: ", user);

    const category = await prisma.category.create({
        data: { userId: user.id, name: "Food", color: "#ff6384"}
    });
    console.log("Category: ", category);

    const categories = await prisma.category.findMany();
    console.log("Categories: ", categories);
}


main().finally(() => prisma.$disconnect());