/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env

const {
    createUser,
    getUserByUsername,
    getPublicRoutinesByUser,
} = require("../db");

router.use(async (req, res, next) => {
  const prefix = `Bearer `;
  const auth = req.header('Authorization');
  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const { username } = jwt.verify(token, JWT_SECRET);

      if (username) {
        req.user = await getUserByUsername({ username });
        next();
      } else {
        res.status(401);
        next({ name: 'token error', message: 'token is invalid' });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    res.status(404);
    next({
      name: 'Authorization Header Error',
      message: `Authorization token must start with ${prefix}`,
    });
  }
});


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
        }, process.env.JWT_SECRET
        );

        res.send({
            message: 'Thank you for signing up',
            token: token,
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
            }, process.env.JWT_SECRET);
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
    if (!req.user) {
      res.status(401);
      res.send({
        error: "ERROR",
        name: 'get/me error',
        message: 'You must be logged in to perform this action',
      });
    } else {
      res.send(req.user);
    }
  } catch ({ name, message }) {
    res.status(409);
    next({ name, message });
  }
});

// GET /api/users/:username/routines
router.get('/:username/routines', async (req, res, next) => {
  try {
    const username = req.params.username;
    const routines = await getPublicRoutinesByUser({ username });
    res.send(routines);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
