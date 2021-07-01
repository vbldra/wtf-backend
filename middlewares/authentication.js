const JsonWebTokenError = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  JsonWebTokenError.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, user) => {
      if (err) return res.sendStatus(403);
      req.userId = user.user;
      console.log("authenticated user with id: " + user.user);
      next();
    }
  );
};
