module.exports.verifyRole = (...allowedRole) => {
  return (req, res, next) => {
    console.log(req);
    console.log(allowedRole);
    if(!req?.role) return res.sendStatus(403); 
    const { role } = req;

    if (!allowedRole.includes(role)) {
      return res.sendStatus(403);
    }
    next();
  }
  
};