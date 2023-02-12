const express = require('express');
const router = express.Router();

const {
    getAllRoutines,
    createRoutine,
    getRoutineById,
    updateRoutine,
    destroyRoutine,
    addActivityToRoutine,
    getRoutineActivitiesByRoutine,
  } = require("../db");


// GET /api/routines
router.get("/", async (req, res, next) => {
    try {
      const allRoutines = await getAllRoutines();
  
      const routines = allRoutines.filter((routines) => {
        return (
          routines.creatorId &&
          routines.isPublic &&
          routines.name &&
          routines.goal
        );
      });
  
      res.send(routines);
    } catch ({ name, message }) {
      next({ name, message });
    }
  });
// POST /api/routines

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities


module.exports = router;
