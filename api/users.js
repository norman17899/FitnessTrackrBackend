/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env

const {
    createUser,
    getUserByUsername,
    getPublicRoutinesByUser,
    getAllRoutinesByUser,
    getUserById,
} = require("../db");

const { tokenAuth, sliceToken } = require("./utils");

router.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) { // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
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
router.get('/:username/routines', tokenAuth, async (req, res, next) => {
  try {
    const { username } = req.params;
    const userInfo = sliceToken(req);

    if(username === userInfo.username){
      const  routines = await getAllRoutinesByUser({username});

      res.send(routines);
    }
    
    const publicRoutines = await getPublicRoutinesByUser({username});

    res.send(publicRoutines);
} catch (error) {
  next(error)
}
  
})
module.exports = router;
