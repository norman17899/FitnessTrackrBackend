const express = require('express');
const router = express.Router();
const {
    getAllActivities, 
    getActivityById, 
    createActivity, 
    getActivityByName, 
    updateActivity, 
    getPublicRoutinesByActivity} = require("../db");
const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken')

// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async(req, res, next) => {
    const { activityId } = req.params;
    try {
        const activity = await getActivityById(activityId)
        if (!activity) {
            res.send({
                name: "ActivityNotFoundError",
                message: `Activity ${activityId} not found`,
                error: "ActivityNotFoundError"
            });
        }
        else {
          //   const publicRoutines = await getPublicRoutinesByActivity(activity)
          const publicRoutines = await getPublicRoutinesByActivity(activity)
            res.send(publicRoutines)
        }
  
    }  catch ({ name, message, error }) {
            next({ name, message, error });
            }
  })
// GET /api/activities
router.get('/', async (req, res, next) => {
    const activities = await getAllActivities();

    try { 
        res.send(activities);
    } catch (error) {
        next(error)
    }
});

// POST /api/activities
router.post('/', async(req, res, next) =>{
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');

    try{
        const token =auth.slice(prefix.length);
        const user = jwt.verify(token, JWT_SECRET);
        const {name, description}=req.body;
        if(user)
        {
            const allActivities = await getAllActivities();
            
            const exists = allActivities.find(element => element.name === name);
            
            if(exists)
            {
                next({
                    name:"ActivityExists",
                    message:`An activity with name ${name} already exists`
                })
            }
            else{
                const newActivity = await createActivity({name, description});

                res.send(newActivity);
            }

        }

    }catch(error){
        next(error);
    }
})
// PATCH /api/activities/:activityId

module.exports = router;
