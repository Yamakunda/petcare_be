const jwt = require("jsonwebtoken");
const Account = require('../models/account.model');
module.exports.requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const account = await Account.findById(decoded.id);
    if (!account) {
      return res.status(401).send('Unauthorized');
    }
    req.id = decoded.id;
    req.role = decoded.role; 
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }

}
