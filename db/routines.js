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

async function getRoutineById(id) {}

async function getRoutinesWithoutActivities() {}

async function getAllRoutines() {
  try {
    const { rows } = await client.query(`
      SELECT routines.*, count, duration, ACTIVITIES.name as "activityName", activities.Id as "activityId", description, username as "creatorName"
      FROM routines
        JOIN routine_activities ON routines.id = routine_activities."routineId"
        JOIN activities ON activities.id = routine_activities."activitiyId"
        JOIN users ON "creatorId" = users.Id
    `); 
    attatchActivitiesToRoutines(rows);
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
      isPublic: routine.isPublic,
      name: routine.name,
      goal: routine.goal,
      activities: []
    };
  }
  const activity = {
    name: routine.activityName,
    id: routine.activityId,
    description: routine.description,
    count: routine.count,
    duration: routine.duration,
  };
  routinesById[routine.id].activities.push(activity);
});

return routinesById;
};
getAllRoutines()

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

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
