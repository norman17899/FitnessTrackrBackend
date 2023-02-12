/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const {
    createUser,
    getUserByUsername,
    getPublicRoutinesByUsers,
    getAllRoutinesByUser,
    getUser,
} = require("../db");

// POST /api/users/register
router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await getUserByUsername(username);

        if (user) {
            res.send({
                error: 'Error',
                name: 'UserExistsError',
                message: `User ${username} is already taken.`
            });
        }

        if (password.length < 8) {
            res.send({
                error: 'Error',
                name: 'PasswordLengthError',
                message: 'Password Too Short!'
            })
        }

        const creatingUser = await createUser({
            username, password
        });

        const token = jwt.sign({
            id: creatingUser.id,
            username
        }, process.env.JWT_SECRET, {
            expiresIn: '1w'
        });

        res.send({
            message: 'Thank you for signing up',
            token,
            user: creatingUser
        });
    } catch ({ name, message }) {
        next({ name, message })
    }
})

// POST /api/users/login
router.post('/login', async (req, res, next) => {
    const {username, password} = req.body;

    if (!username || !password) {
        next({
            name: 'MissingCredentialsError',
            message: "Please supply both a username and password"
        });
    }

    try {
        const user = await getUserByUsername(username);

        if (user && user.password == password) {
            const token = jwt.sign({
                id: user.id, 
                username
            }, process.env.JWT_SECRET, {
                expiresIn: '1w'
            });

            res.send({
                message: "you're logged in!",
                token,
                user
            });
        } else {
            next({
                name: 'IncorrectCredentialsError',
                message: 'Username or password is incorrect'
            });
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
})
// GET /api/users/me
router.get('/me', async (req, res, next) => {
    try {
        if (req.user) {
            res.send(req.user);
        } else {
            res.status(401)
            res.send({
                error: "MissingUserError",
                message: "You must be logged in to perform this action",
                name: "MIssingUserError"
            });
        }
    } catch (error) {
        next(error)
    }
});
// GET /api/users/:username/routines

module.exports = router;
