/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env;

const {
    createUser,
    getUserByUsername,
    getPublicRoutinesByUsers,
    getAllRoutinesByUser,
} = require("../db");

// POST /api/users/register
router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await getUserByUsername(username);

        if (user) {
            res.send({
                error: "Error",
                name: "UserExistsError",
                message: `User ${username} is already taken.`,
            });
        }

        if (password.length < 8) {
            res.send({
                error: "password too short",
                message: "Password Too Short!",
                name: "wrong",
            });
        }

        const creatingUser = await createUser({ username, password });

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username
            },
            JWT_SECRET,
            {
                expiresIn: "1w",
            }
        );

        res.send({
           message: 'Thank you for signing up!',
           token,
           user
        });
     
    } catch ({ name, message }) {
        next({ name, message })
    }
});

// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
