// /:userId/summary?month=10-2023 => fetch summary of expenses for a specific month
// /:userId/summary => fetch summary of expenses for all time

const express = require('express');
const router = express.Router({ mergeParams: true });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch summary of expenses for a specific month
router.get('/', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const [month, year] = req.query.month.split('-');

    const startDate = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = new Date(year, month - 1, lastDay);

    try {
        const summary = await prisma.expense.groupBy({
            by: ['categoryId'],
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            _count: {
                _all: true
            }
        });
        res.json(summary);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;