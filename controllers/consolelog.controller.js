module.exports.log = async (req, res) => {
  console.log("This is a console log");
  console.log(req.body);
  res.status(200);
};