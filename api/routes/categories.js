const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch all categories
router.get('/', async (req, res) => {
    const categories = await prisma.category.findMany();
    res.json(categories);
});

// Create a custom category
router.post('/', async (req, res) => {
    // basic category => userId = null
    // custom category => userId = user.id
    // parse userId from JWT after login

    const { name, color, userId } = req.body;

    if (!name || !color || !userId) {
        return res.status(400).json({ error: "Name, color, and userId are required" });
    }

    try {
        const category = await prisma.category.create({
            data: { name, color, userId, isDefault: false }
        });
        res.status(201).json(category);
    } catch (error) {
        console.error("Error creating category: ", error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;