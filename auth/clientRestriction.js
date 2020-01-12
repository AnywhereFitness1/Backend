const jwt = require("jsonwebtoken");
if (process.env.NODE_ENV !== "production") {
  dotenv = require("dotenv");
  dotenv.config();
}

const secret = process.env.SECRET_KEY;

function clientRestrict(req, res, next) {
  const token = req.headers.authorization;
  jwt.verify(token, secret, (error, decodedToken) => {
    if (error) {
      res.status(401).json({ message: error });
    } else if (decodedToken.department == "client") {
      console.log(decodedToken);
      res.status(401).json({
        message: "Must be logged-in as an Instructor to view/edit/post to this"
      });
    } else if (decodedToken.department == "instructor") {
      res.locals.decodedToken = decodedToken;
      next();
    }
  });
}

module.exports = clientRestrict;
