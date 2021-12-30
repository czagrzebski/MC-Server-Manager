const db = require("../config/db");

async function getAllUsers(req, res) {
  const users = await db("USERS")
    .select("id", "username")
    .catch((err) => res.status(500).send("An unknown error occurred"));

  let response = {
    users: [],
  };

  //Add Users to Response Object
  users.forEach((user) => response.users.push(user));

  res.json(response);
}

module.exports = {
  getAllUsers,
};
