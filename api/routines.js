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
    getAllPublicRoutines
  } = require("../db");


// GET /api/routines
router.get("/", async (req, res, next) => {
    try {
      const publicRoutines = await getAllPublicRoutines();
  
      res.send(publicRoutines);
    } catch ({ name, message }) {
      next({ name, message });
    }
  });
// POST /api/routines

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities


module.exports = router;
