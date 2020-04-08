const jwt = require("jsonwebtoken");
const secret = require("../../config/auth.json").secret;

module.exports = (req, res, next) => {
  
  const [token_type, jwt_token] = req.headers["authorization"].split(" ");

  let user = jwt.verify(jwt_token, secret);
  req.user = user;

  next();
};
