// /:userId/expenses?month=10-2023 => fetch all expenses of user for a specific month
// /:userId/expenses => create a new expense
// /:userId/expenses => update an existing expense
// /:userId/expenses => delete an existing expense

const express = require('express');
const router = express.Router({ mergeParams: true });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch all expenses of a user for a specific month
router.get('/', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const month = req.query.month;

    if (!month) {
        return res.status(400).json({ error: "Month query parameter is required" });
    }

    const [monthPart, year] = month.split('-'); // MM-YYYY format

    const startDate = new Date(year, monthPart - 1, 1);
    const lastDay = new Date(year, monthPart, 0).getDate();
    const endDate = new Date(year, monthPart - 1, lastDay);

    try {
        const expenses = await prisma.expense.findMany({
            where : {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
        res.json(expenses);
    } catch (error) {
        console.error("Error fetching expenses: ", error);
        res.status(400).json({ error: error.message });
    }
});

// Create a new expense
router.post('/', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const { amount, date, categoryId, note, type } = req.body;

    const [month, day, year] = date.split('-');
    const utcDate = new Date(Date.UTC(year, month - 1, day));

    if (!amount || !date || !categoryId || !type) {
        return res.status(400).json({ error: "Amount, date, categoryId, and type are required" });
    }

    try {
        const expense = await prisma.expense.create({
            data: {
                amount: parseFloat(amount), 
                date: utcDate,
                categoryId: parseInt(categoryId),
                type,
                userId: userId,
                note
            }
        });
        res.json(expense);
    } catch (error) {
        console.error("Error creating expense: ", error);
        res.status(400).json({ error: error.message });
    }
});

// Update an existing expense
router.put('/:expenseId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const expenseId = parseInt(req.params.expenseId);
    const { amount, date, categoryId, note, type } = req.body;

    if (!amount || !date || !categoryId || !type) {
        return res.status(400).json({ error: "Amount, date, categoryId, and type are required" });
    }

    try {
        const expense = await prisma.expense.update({
            where: { id: expenseId, userId: userId },
            data: {
                amount,
                date: new Date(date),
                categoryId: parseInt(categoryId),
                type,
                note
            }
        });
        res.json(expense);
    } catch (error) {
        console.error("Error updating expense: ", error);
        res.status(400).json({ error: error.message });
    }
});

// Delete an existing expense
router.delete('/:expenseId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const expenseId = parseInt(req.params.expenseId);

    try {
        await prisma.expense.delete({
            where: { id: expenseId, userId: userId }
        });
        res.status(204).send(); // No content
    } catch (error) {
        console.error("Error deleting expense: ", error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;