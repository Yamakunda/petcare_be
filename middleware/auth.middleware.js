const jwt = require("jsonwebtoken");

module.exports.requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
    // console.log("Verify token");
    if (err) res.sendStatus(403);
    // console.log(decodedToken);
    req.id = decodedToken.id;
    req.role = decodedToken.role; 
    // console.log("verified" );
    next();
  });

}