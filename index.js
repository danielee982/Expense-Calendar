import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.create({
        data: { email: "test@example.com", name: "john doe"}
    });
    console.log("User: ", user);

    const category = await prisma.category.create({
        data: { userId: user.id, name: "Grocery", color: "#ff6384", isDefault: true }
    });
    console.log("Category: ", category);

    const categories = await prisma.category.findMany({
        where: {
            OR: [
                {userId: null},
                {userId: user.id}
            ]
        }
    });
    console.log("Categories: ", categories);

    const exampleExpense = await prisma.expense.create({
        data: {
            userId: user.id,
            categoryId: category.id,
            amount: 10,
            type: 'OUT',
            date: new Date(),
            note: "grocery shopping",
        }
    });
    console.log("Example Expense: ", exampleExpense);
}

main().finally(() => prisma.$disconnect());