const express = require('express');
const router = express.Router();
const {
    getAllActivities, 
    getActivityById, 
    createActivity, 
    getActivityByName, 
    updateActivity, 
    getPublicRoutinesByActivity} = require("../db");

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
          const publicRoutines = await getPublicRoutinesByActivity(activity)
            res.send(publicRoutines)
        }
  
    }  catch ({ name, message, error }) {
            next({ name, message, error });
            }
  })
// GET /api/activities
router.get('/', async (req, res, next) => {
    const allActivities = req.params.allActivities
    try{
        const returnedActivities = await getAllActivities(allActivities);
        
       
        res.send(
            returnedActivities
    )
    }catch ({name, message}){
        next({name, message})
    }
})
// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = router;
