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
} = require("../db");

const { tokenAuth, sliceToken } = require("./utils");


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
router.get('/me', tokenAuth, async (req, res, next) => {

    try{
     const userInfo = sliceToken(req);
    
     const user = await getUserByUsername(userInfo.username)
   
     if (user) {
       res.send({
         id: user.id, 
         username: user.username
       });
     }
     else {
         res.send('User unavailable');   
     }
   } catch (error) {
     next(error);
   }
   
   })

// GET /api/users/:username/routines
router.get("/:username/routines", async (req, res, next) => {
    try {
      const { username } = req.params;
      const user = await getUserByUsername(username);
      if (!user) {
        next({
          name: "NoUser",
          message: `Error looking up user ${username}`,
        });
      } else if (req.user && user.id === req.user.id) {
        const routines = await getAllRoutinesByUser({ username: username });
        res.send(routines);
      } else {
        const publicRoutines = await getPublicRoutinesByUser({
          username: username,
        });
        res.send(publicRoutines);
      }
    } catch (e) {
      next(e);
    }
  });
module.exports = router;
