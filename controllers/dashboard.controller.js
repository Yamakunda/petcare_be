const order = require("../models/order.model");
const Account = require("../models/account.model");
const appointment = require("../models/appointment.model");
const pet = require("../models/pet.model");
const rescueRequest = require("../models/rescueRequest.model");
module.exports.getDashboard = async (req, res) => {
  const { id } = req.params;
  try {
    const account = await Account.findById(id);
    const pendingOrders = await order.countDocuments({ order_status:{ $ne: "Đã xử lí" }});
    const pendingAppointments = await appointment.countDocuments({ status: { $ne: "Đã xử lí" } });
    const pendingPets = await pet.countDocuments({requestStatus: { $ne: "Đã xử lí" }});
    const pendingRescueRequests = await rescueRequest.countDocuments({ requestStatus: { $ne: "Đã xử lí" } });
    // const admin_account = Account.findById(id);
    const dashboard = {
      pendingOrders: pendingOrders,
      pendingAppointments: pendingAppointments,
      pendingPets: pendingPets,
      pendingRescueRequests: pendingRescueRequests,
    };
    res.status(200).json({account, dashboard});
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};