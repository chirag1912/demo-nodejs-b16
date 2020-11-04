const jwt = require("jsonwebtoken");

function authorize(req, res, next) {
  if (req.headers.authorization != undefined) {
    jwt.verify(
      req.headers.authorization,
      process.env.JWT_KEY,
      (err, decode) => {
        if (err) throw err;
        if (decode) {
          console.log(decode);
          req.role = decode.role;
          next();
        } else {
          res.send("Invalid token");
        }
      }
    );
  } else {
    res.send("No token in the header");
  }
}

function allowUser(role) {
  return function (req, res, next) {
    if (req.role && req.role == role) {
      next();
    } else {
      res.status(403).json({
        message: "FORBIDDEN",
      });
    }
  };
}

module.exports = { authorize, allowUser };
