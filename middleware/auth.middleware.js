const jwt = require("jsonwebtoken");

module.exports.requireAuth = (req, res, next) => {
  const auth = req.headers["authorization"];
  const token = auth && auth.split(" ")[1];
  if(token){
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if(err){
        console.log(err.message);
        res.sendStatus(403);
      } else {
        req.id = decodedToken.id;
        next();
      }
    });
  } else {
    res.sendStatus(401);
  }
}