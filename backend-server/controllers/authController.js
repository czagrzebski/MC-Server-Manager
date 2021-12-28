const db = require("../config/db");
const bcrypt = require("bcrypt");
const { response } = require("express");

const saltRounds = 10;

async function createUser(req, res) {
  const { username, password } = req.body;

  //TODO: Password Validation
  //TODO: Check if user already exists in DB

  //TODO: Reorganize this async call flow. Could lead to issues with error handling
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    console.log(hashedPassword);
    db.insert({
      username: username,
      password: hashedPassword,
    })
      .into("USERS")
      .then((resp) => {
        res.status(201).send("User successfully created");
      })
      .catch((err) => res.status(500).send("Failed to create user"));
  });
}

async function removeUser(req, res) {}

async function changePassword(req, res) {}

module.exports = {
  createUser: createUser,
};
