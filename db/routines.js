const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {rows: [routine]} = await client.query(`
      INSERT INTO routines ("creatorId", "isPublic", name, goal)
      VALUES($1, $2, $3, $4)
      RETURNING *;
    `, [creatorId, isPublic, name, goal]);
      return routine;
  } 
  catch (error) {
    console.log(error)
    throw error
   }
}

async function getRoutineById(id) {
  try {
    const { row: [routine] } = await client.query(`
      SELECT * FROM routines
      WHERE id=$1;
    `, [id]);

    return routine;
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM routines
    `)
    return rows;
   } catch (error) {
    console.log(error)
    throw error;
   }
  }

const allRoutines = `SELECT routines.*, count, duration, activities.name as "activityName", activities.id as "activityId", description, username as "creatorName", routine_activities.id AS "routineActivityId"
FROM routines
  JOIN routine_activities ON routines.id = routine_activities."routineId"
  JOIN activities ON activities.id = routine_activities."activityId"
  JOIN users ON "creatorId" = users.Id`

async function getAllRoutines() {
  try {
    const { rows } = await client.query(allRoutines); 
    let routines = attatchActivitiesToRoutines(rows);
    routines = Object.values(routines);
    return routines;
  }
    catch (error) {
    console.log(error)
    throw error;
  }
};

const attatchActivitiesToRoutines = (routines) => {
  const routinesById = {} 
   routines.forEach(routine => { 
     if (!routinesById[routine.id]) {
      routinesById[routine.id] = {
        id: routine.id,
        creatorId: routine.creatorId,
        creatorName: routine.creatorName,      
        isPublic: routine.isPublic,
        name: routine.name,
        goal: routine.goal,
        activities: [],
      };
    }
    const activity = {
      name: routine.activityName,
      id: routine.activityId,
      description: routine.description,
      count: routine.count,
      duration: routine.duration,
      routineActivityId: routine.routineActivityId,
      routineId: routine.id
    };
    routinesById[routine.id].activities.push(activity);
  });
  
  return routinesById;
  };
//getAllRoutines()

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(`
      ${ allRoutines }
        WHERE "isPublic" = true
    `); 
    let routines = attatchActivitiesToRoutines(rows);
    routines = Object.values(routines);
    return routines;
  }
    catch (error) {
    console.log(error)
    throw error;
  }
}


async function getAllRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(`
      ${ allRoutines }
        WHERE username=$1
    `, [username]); 
    let routines = attatchActivitiesToRoutines(rows);
    routines = Object.values(routines);
    return routines;
  }
    catch (error) {
    console.log(error)
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(`
      ${ allRoutines }
        WHERE username=$1 AND "isPublic" = true
    `, [username]); 
    let routines = attatchActivitiesToRoutines(rows);
    routines = Object.values(routines);
    return routines;
  }
    catch (error) {
    console.log(error)
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
