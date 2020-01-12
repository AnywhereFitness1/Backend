const jwt = require("jsonwebtoken");
if (process.env.NODE_ENV !== "production") {
  dotenv = require("dotenv");
  dotenv.config();
}

const secret = process.env.SECRET_KEY;

function authenticate(req, res, next) {
  const token = req.headers.authorization;
  jwt.verify(token, secret, (error, decodedToken) => {
    if (error) {
      res.status(401).json({ message: error });
    } else {
      res.locals.decodedToken = decodedToken;
      next();
    }
  });
}

module.exports = authenticate;
