const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity
try {
  const {rows: [activity]} = await client.query(`
    INSERT INTO activities (name, description)
    VALUES($1, $2)
    RETURNING *;
  `, [name, description]);
    return activity;
} 
catch (error) {
  console.log(error)
  throw error
 }
}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM activities;
    `);

    return rows;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

async function getActivityById(id) {
  try {
    const { rows: [activity] } = await client.query(`
      SELECT * FROM activities
      WHERE id=$1;
    `, [id]);

    return activity;

  } catch (error) {
    console.log(error)
    throw error;
  }
}

async function getActivityByName(name) {
  try {
    const { rows: [activity] } = await client.query(`
      SELECT * FROM activities
      WHERE name=$1;
    `, [name]);

    return activity;

  } catch (error) {
    console.log(error)
    throw error;
  }
}

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
