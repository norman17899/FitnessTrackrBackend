const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  // const SALT_COUNT = 10;

  // const isValid = await bcrypt.compare(password, hashedPassword)
 try {
    const {rows: [user]} = await client.query(`
      INSERT INTO mytablename (username, password)
      VALUES($1, $2)
      RETURNING *;
    `, [username, password]);
    delete user.password;
    return user;
  } catch (error) {
    throw error
  }
}

async function getUser({ username, password }) {
  // const hashedPassword = user.password;

  // const isValid = await bcrypt.compare(password, hashedPassword)
  
  try {
    const user = await getUserByUsername(username);
    if (user.password === password) {
      delete user.password
      return user
    }

  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {
  try {
    const { rows: [user] } = await client.query(`
        SELECT *
        FROM mytablename
        WHERE username=$1
    `, [userName]);

    return user;
} catch (error) {
    throw error;
}
}


module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
