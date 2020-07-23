const router = require("express").Router();
const bcrypt = require("bcrypt");
const auth = require("./authenticate-middleware");
const dataBase = require("../database/models/users");
const classes = require("../database/models/classes");
const jwt = require("jsonwebtoken");
const checkClassById = require("./checkClassById-middleware");
const requireAll = require("./requireAll-middleware");
const clientRestrict = require("./clientRestriction");

//LOGIN/REGISTER//

router.get("/users", clientRestrict, (req, res) => {
  dataBase
    .find(req.query)
    .then((hubs) => {
      res.status(200).json(hubs);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "User information could not be retreived",
      });
    });
});

router.post("/register", (req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;
  if (!req.body.username || !req.body.password || !req.body.department) {
    res.status(400).json({
      message:
        "Please provide username, password and department before posting to endpoint -Anywhere Fitness Inc.",
    });
  } else if (credentials.department === "instructor") {
    console.log("success");
    if (credentials.code === "secret") {
      delete req.body.code;
      dataBase
        .add(req.body)
        .then((hub) => {
          console.log(hub);
          res
            .status(201)
            .json({ message: "Instructor successfully registered." });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            message: "Error adding the user",
          });
        });
    } else {
      res.status(500).json({ message: "Incorrect code for instructor" });
    }
  } else {
    dataBase
      .add(req.body)
      .then((hub) => {
        res.status(201).json({ message: "User successfully registered." });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "Error adding the user",
        });
      });
  }
});

router.post("/login", (req, res) => {
  dataBase
    .findBy(req.body.username)
    .first()
    .then((user) => {
      if (!req.body.username || !req.body.password) {
        res.status(400).json({
          message:
            "Please provide username, password and department before posting to endpoint -Anywhere Fitness Inc.",
        });
      } else if (user && bcrypt.compareSync(req.body.password, user.password)) {
        token = generateToken(user);
        const type = user.department;

        res
          .status(200)
          .json({ message: `Welcome ${user.username}`, token, type });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Unexpected error" });
    });
});

//CLASSES ENDPOINTS//

router.get("/classes", auth, (req, res) => {
  classes
    .find(req.query)
    .then((hubs) => {
      res.status(200).json(hubs);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "User information could not be retreived",
      });
    });
});

router.get("/:id", auth, checkClassById, (req, res) => {
  classes
    .findById(req.params.id)
    .then((project) => {
      res.status(200).send(project);
    })
    .catch((error) => {
      res.send(error);
    });
});

router.post("/createclass", clientRestrict, (req, res) => {
  classes
    .add(req.body)
    .then((hub) => {
      res.status(201).json({ message: "Class successfully created" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the class",
      });
    });
});

router.post("/search", (req, res) => {
  const filter = req.body;
  classes
    .find(filter)
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

//

router.delete("/:id", clientRestrict, checkClassById, (req, res) => {
  classes
    .remove(req.params.id)
    .then((hub) => {
      res.status(201).send({ message: "class successfully deleted!" });
    })
    .catch((error) => {
      res.status(500).json({ message: "error deleting the class" });
    });
});

router.put("/:id", clientRestrict, checkClassById, requireAll, (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  classes
    .update(id, changes)
    .then((user) => {
      classes.findById(req.params.id).then((project) => {
        res
          .status(200)
          .send({ message: "Here is your updated project", project });
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "The target could not be modified" });
    });
});

// router.post("/reservespot", auth, (req,res) => {

// })

function generateToken(user) {
  const payload = {
    user: user.username,
    department: user.department,
    subject: user.id,
  };
  const options = {
    expiresIn: "1d",
  };
  return jwt.sign(payload, secret, options);
}

const secret = process.env.SECRET_KEY;

module.exports = router;
