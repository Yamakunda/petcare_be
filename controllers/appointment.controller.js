const Appointment = require("../models/appointment.model");
module.exports.addAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json({ appointment });
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.getListAppointment = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.getAppointmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json({ appointment });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  // const { name, stock, category, price, discount, description, status, image } = req.body;
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json({ appointment });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.deleteAppointment = async (req, res) => {
  try {
      const appointmentId = req.params.id;
      
      // Find the appointment by ID and delete it
      const appointment = await Appointment.findByIdAndDelete(appointmentId);
      
      if (!appointment) {
          return res.status(404).json({ message: 'Appointment not found' });
      }
      
      res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};