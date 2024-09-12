const Pet = require("../models/pet.model");
module.exports.addPet = async (req, res) => {
  console.log(req.body);
  // const { name, stock, brand, category, price, discount, description, status, image } = req.body;
  // const discountReal = discount || "0%";
  // const descriptionReal = description || "Không có mô tả";
  // const imageReal = image || ["https://res.cloudinary.com/dzm879qpm/image/upload/v1724509562/defautProduct_mlmwsw.png"];
  // const statusReal = status || "Hoạt động";
  try {
    const pet = await Pet.create(req.body);
    res.status(201).json({ pet });
    console.log(pet);
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.getListPet = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.status(200).json({ pets });
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.getPetById = async (req, res) => {
  const { id } = req.params;
  try {
    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }
    res.status(200).json({ pet });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.updatePet = async (req, res) => {
  console.log("Update Pet");
  const { id } = req.params;
  // const { name, stock, category, price, discount, description, status, image } = req.body;
  try {
    const pet = await Pet.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }
    res.status(200).json({ pet });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.deletePet = async (req, res) => {
  try {
      const petId = req.params.id;
      
      // Find the pet by ID and delete it
      const pet = await Pet.findByIdAndDelete(petId);
      
      if (!pet) {
          return res.status(404).json({ message: 'Pet not found' });
      }
      
      res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};