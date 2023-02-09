const client = require("./client");

async function addActivityToRoutine({ routineId, activityId, count, duration}) {
  try {
    const { rows: [ routineActivity ] } = await client.query(`
      INSERT INTO routine_activities ("routineId", "activityId", count, duration) 
      VALUES ($1, $2, $3, $4) 
      ON CONFLICT ("routineId", "activityId") DO NOTHING
      RETURNING *;
    `, [routineId, activityId, count, duration]);
    return routineActivity;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

async function getRoutineActivityById(id) {
  try {
    const { rows: [ routineActivity ] } = await client.query(`
      SELECT id
      FROM routine_activities
      WHERE id=$1
    `,[id]);

    return routineActivity;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: routineActivity } = await client.query(`
      SELECT id 
      FROM routine_activities 
      WHERE "routineId"=${ id };
    `);

    const routines = await Promise.all(routineActivity.map(
      routine => getRoutineActivityById( routine.id )
    ));

    return routines;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  try {
    const { rows: [ routineActivity ] } = await client.query(`
      UPDATE routine_activities
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return routineActivity
  } catch (error) {
    console.log(error)
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  // need to complete this
  const response = await client.query(`
      SELECT * FROM routine_activities
      WHERE id=$1
      `, [id]);
    await client.query(`
      DELETE FROM routine_activities
      WHERE id=$1
      `, [id]);
   return response.rows[0];
}


async function canEditRoutineActivity(routineActivityId, userId) {

   await client.query {
    `SELECT routine_activities.id AS "routineActivityId"
  FROM routine_activities
  JOIN users ON "creatorId" = users.Id`
      return true
  }
   where 
      }
    // check to see if ids match
    // if ids match great
    // if ids dont match oh no

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
