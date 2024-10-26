const Adopt = require("../models/adopt.model");
module.exports.addAdopt = async (req, res) => {
  console.log(req.body);
  try {
    const adopt = await Adopt.create(req.body);
    res.status(201).json({ adopt });
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.getListAdopt = async (req, res) => {
  try {
    const adopts = await Adopt.find();
    res.status(200).json({ adopts });
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.getAdoptById = async (req, res) => {
  const { id } = req.params;
  try {
    const adopt = await Adopt.findById(id);
    if (!adopt) {
      return res.status(404).json({ error: "Adopt not found" });
    }
    res.status(200).json({ adopt });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.updateAdopt = async (req, res) => {
  console.log("Update Adopt");
  const { id } = req.params;
  // const { name, stock, category, price, discount, description, status, image } = req.body;
  try {
    const adopt = await Adopt.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!adopt) {
      return res.status(404).json({ error: "Adopt not found" });
    }
    res.status(200).json({ adopt });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.deleteAdopt = async (req, res) => {
  try {
      const adoptId = req.params.id;
      
      // Find the adopt by ID and delete it
      const adopt = await Adopt.findByIdAndDelete(adoptId);
      
      if (!adopt) {
          return res.status(404).json({ message: 'Adopt not found' });
      }
      
      res.status(200).json({ message: 'Adopt deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};