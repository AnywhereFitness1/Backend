const classes = require("../database/models/classes");

function checkClassById(req, res, next) {
  classes.findById(req.params.id).then(id => {
    if (id < 1) {
      res.status(404).send({ message: "No class with the specified ID" });
    } else {
      next();
    }
  });
}

module.exports = checkClassById;
