const db = require("../config/db");

async function getAllUsers(req, res) {
  const users = await db("USERS")
    .select("id", "username")
    .catch((err) => {
      next(new Error("Unknown Error Occurred"));
    });

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
