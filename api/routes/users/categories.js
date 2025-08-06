// /:userId/categories => fetch all categories of user
// /:userId/categories => create a custom category
// /:userId/categories/:categoryId => update a custom category
// /:userId/categories/:categoryId => delete a custom category

const express = require('express');
const router = express.Router({ mergeParams: true });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch all categories of a user
router.get('/', async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const categories = await prisma.category.findMany({
            where: {
                OR: [
                    { userId: userId, isDefault: false }, // Custom categories
                    { isDefault: true } // Default categories
                ]
            }
        });
        res.json(categories);
    } catch (error) {
        console.error("Error fetching categories: ", error);
        res.status(400).json({ error: error.message });
    }
});

// Create a custom category
router.post('/', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const { name, color } = req.body;

    if (!name || !color) {
        return res.status(400).json({ error: "Name and color are required" });
    }

    try {
        const category = await prisma.category.create({
            data: {
                name,
                color,
                userId
            }
        });
        res.json(category);
    } catch (error) {
        console.error("Error creating category: ", error);
        res.status(400).json({ error: error.message });
    }
});

// Update a custom category
router.put('/:categoryId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const categoryId = parseInt(req.params.categoryId);
    const { name, color } = req.body;

    if (!name || !color) {
        return res.status(400).json({ error: "Name and color are required" });
    }

    const category = await prisma.category.findFirst({
        where: { id: categoryId, userId: userId, isDefault: false }
    });
    if (!category) {
        return res.status(404).json({ error: "Category not found or is a default category" });
    }

    try {
        const updated = await prisma.category.update({
            where: {
                id: categoryId
            },
            data: {
                name,
                color
            }
        });
        res.json(updated);
    } catch (error) {
        console.error("Error updating category: ", error);
        res.status(400).json({ error: error.message });
    }

});

// Delete a custom category
router.delete('/:categoryId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const categoryId = parseInt(req.params.categoryId);

    const category = await prisma.category.findFirst({
        where: { id: categoryId, userId: userId }
    });
    if (!category) {
        return res.status(404).json({ error: "Category not found or is a default category" });
    }
    else if (category.isDefault) {
        return res.status(403).json({ error: "Cannot delete a default category" });
    }

    try {
        const deleted = await prisma.category.delete({
            where: {
                id: categoryId,
            }
        });
        res.json(deleted);
    } catch (error) {
        console.error("Error deleting category: ", error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;