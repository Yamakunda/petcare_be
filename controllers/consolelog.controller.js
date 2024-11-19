const appointment = require("../models/appointment.model"); 
module.exports.log = async (req, res) => {
  console.log("This is a console log");
  console.log(req.body);
  res.status(200);
};
module.exports.test = async (req, res) => {
  try {
    await appointment.updateMany({}, { $set: { service: [] } });
    res.status(200).json({ message: "Updated all appointments with service attribute" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};