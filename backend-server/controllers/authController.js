const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//temporary solution for storing refresh tokens which
//only saves tokens for current runtime
//will use database/redis in the future
const refreshTokens = [];
const saltRounds = 10;

/**
 * Creates a user and stores it in the database
 * Checks if user does not exist and validates password
 */
async function createUser(req, res) {
  const { username, password } = req.body;

  //Fetch User
  const user = await db("USERS")
    .where("username", username)
    .first()
    .then((user) => {
      return user;
    })
    .catch((err) => {
      res.status(500).send("An unknown error has occurred");
    });

  //Check if that user already exists in the DB
  if (user) res.status(409).send("User already exists!");

  //Hash/Salt Password and store new user in DB
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) res.status(500).send("An unknown error occurred");

    //insert user into database
    db.insert({
      username: username,
      password: hashedPassword,
    })
      .into("USERS")
      .then((resp) => {
        res.status(201).send("User successfully created");
      })
      .catch((error) => res.status(400));
  });
}

/**
 * Generates Access Token and Refresh Token upon
 * successful authorization.
 */
async function login(req, res) {
  const { username, password } = req.body;

  //Fetch User
  const user = await db("USERS")
    .where("username", username)
    .first()
    .then((user) => {
      return user;
    })
    .catch((err) => {
      res.status(500).send("An unknown error has occurred");
    });

  //User Does Not Exist in Database
  if (!user) {
    res.status(401).send("Invalid Credentials");
    return;
  }

  //Compare password to one stored in DB. If correct, issue a JWT.
  bcrypt.compare(password, user.password, function (err, result) {
    if (err) {
      res.status(500).send("An unknown error has occurred");
    }
    if (result) {
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(
        {username: user.username, id: user.id},
        process.env.ACCESS_TOKEN_SECRET, //TODO: Create a separate refresh token secret
        { expiresIn: "12h" }
      );
      refreshTokens[refreshToken] = user; //TODO: Store Token in DB
      const response = {
        user: user.username,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      res.status(200).json(response);
    } else {
      res.status(401).send("Invalid Credentials");
    }
  });
}

/**
 * Generates Access Token given Access Token Secret
 * and username
 */
function generateAccessToken(user) {
  return jwt.sign({ username: user.username, id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });
}

/**
 * Deletes Refresh Token from Memory (eventually a DB)
 */
async function logout(req, res) {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
}

/**
 * Issues a new Access Token given a valid refresh token
 */
async function getNewToken(req, res) {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);

  if (refreshTokens[refreshToken] == null) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }
    const accessToken = generateAccessToken(user);
    res.json({ accessToken: accessToken });
  });
}

/**
 * Middleware for Access Token Validation 
 */
async function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; //check if auth header exists
  //check if token exists
  if (token == null) return res.status(401).send("Unauthorized Access");

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user;
    next();
  });
}

module.exports = {
  createUser,
  login,
  logout,
  getNewToken,
  verifyToken,
};
