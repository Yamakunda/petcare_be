const RescueRequest = require("../models/rescueRequest.model");
module.exports.addRescue = async (req, res) => {
  console.log(req.body);

  try {
    const rescue = await RescueRequest.create(req.body);
    res.status(201).json({ rescue });
    console.log(rescue);
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.getListRescue = async (req, res) => {
  try {
    const rescues = await RescueRequest.find();
    res.status(200).json({ rescues });
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.getRescueById = async (req, res) => {
  const { id } = req.params;
  try {
    const rescue = await RescueRequest.findById(id);
    if (!rescue) {
      return res.status(404).json({ error: "RescueRequest not found" });
    }
    res.status(200).json({ rescue });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.updateRescue = async (req, res) => {
  console.log("Update RescueRequest");
  const { id } = req.params;
  // const { name, stock, category, price, discount, description, status, image } = req.body;
  try {
    const rescue = await RescueRequest.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!rescue) {
      return res.status(404).json({ error: "RescueRequest not found" });
    }
    res.status(200).json({ rescue });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.deleteRescue = async (req, res) => {
  try {
      const rescueId = req.params.id;
      
      // Find the rescue by ID and delete it
      const rescue = await RescueRequest.findByIdAndDelete(rescueId);
      
      if (!rescue) {
          return res.status(404).json({ message: 'RescueRequest not found' });
      }
      
      res.status(200).json({ message: 'RescueRequest deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};