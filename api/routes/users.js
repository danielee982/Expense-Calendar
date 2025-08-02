const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
    const {email, name} = req.body;

    try {
        const user = await prisma.user.create({
          data: {
            email, name
          }
        });
        res.json(user);
    } catch (error) {
        console.error("Error creating user: ", error);
        res.status(400).json({error: error.message});
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error("Error fetching user: ", error);
        res.status(400).json({error: error.message});
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user: ", error);
        res.status(400).json({error: error.message});
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { email, name } = req.body;

    if (!email || !name) {
        return res.status(400).json({ error: "Email and name are required" });
    }

    if (isNaN(parseInt(id))) {
        return res.status(400).json({ error: "Invalid user ID" });
    }

    try {
        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { email, name }
        });
        res.json(user);
    } catch (error) {
        console.error("Error updating user: ", error);
        res.status(400).json({error: error.message});
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.delete({
            where: { id: parseInt(id) }
        });
        res.json(user);
    } catch (error) {
        console.error("Error deleting user: ", error);
        res.status(400).json({error: error.message});
    }
});

module.exports = router;
