const jwt = require("jsonwebtoken");
module.exports = async function (req, res, next) {
  const token = req.headers.authorization;
  try {
    if (token) {
      jwt.verify(token, process.env.jwtSecret, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }

        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.send(500);
    console.log(error);
  }
};
