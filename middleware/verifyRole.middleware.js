module.exports.verifyRole = (...allowedRole) => {
  return (req, res, next) => {
    if(!req?.role) return res.sendStatus(403); 
    const { role } = req;
    if (!allowedRole.includes(role)) {
      return res.sendStatus(403);
    }
    next();
  }
  
};