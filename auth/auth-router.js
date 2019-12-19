const router = require("express").Router();
const bcrypt = require("bcrypt");
const auth = require("./authenticate-middleware");
const dataBase = require("../database/models/users");
const jwt = require("jsonwebtoken");

router.get("/users", auth, (req, res) => {
  dataBase
    .find(req.query)
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "User information could not be retreived"
      });
    });
});

router.post("/register", (req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;
  dataBase
    .add(req.body)
    .then(hub => {
      res.status(201).json(hub);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the hub"
      });
    });
});

router.post("/login", (req, res) => {
  dataBase
    .findBy(req.body.username)
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        token = generateToken(user);
        res.status(200).json({ message: `Welcome ${user.username}`, token });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Unexpected error" });
    });
});

function generateToken(user) {
  const payload = {
    user: user.username,
    subject: user.id
  };
  const options = {
    expiresIn: "1d"
  };
  return jwt.sign(payload, secret, options);
}

const secret = "easy password";

module.exports = router;
