const client = require("./client");

async function addActivityToRoutine({ routineId, activityId, count, duration}) {
  try {
    const { rows: [ routineactivity ] } = await client.query(`
      INSERT INTO routine_activities ( "routineId", "activityId", duration, count ) 
      VALUES($1, $2, $3, $4) 
      RETURNING *;
    `, [routineId, activityId, count, duration]);
    // this could be used later to finish this function 
    // ON CONFLICT ON CONSTRAINT ("routineId", "activityId") DO NOTHING 

    return routineactivity;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

async function getRoutineActivityById(id) {}

async function getRoutineActivitiesByRoutine({ id }) {}

async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
