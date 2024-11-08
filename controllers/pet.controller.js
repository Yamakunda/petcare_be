const Pet = require("../models/pet.model");
const imagekit = require("../config/imagekit");
module.exports.addPet = async (req, res) => {
  try {
    if (req.body.image.public_id === "null") {
      const result = await imagekit.upload({
        file: req.body.image.url,
        fileName: "pet_image",
        folder: "pets"
      });
      req.body.image = { public_id: [result.fileId], url: [result.url] };
    } else {
      req.body.image = { public_id: ["null"], url: ["https://ik.imagekit.io/yamakun/No_Image_Available.jpg?updatedAt=1731058703734"] };
    }
    
    const pet = await Pet.create(req.body);
    res.status(201).json({ pet });
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.getListPet = async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 });
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
  const { id } = req.params;
  const currentPet = await Pet.findById(id);
  const ImgId = currentPet.image.public_id;
  try {
    // if (ImgId[0] != "null" || !currentPet) {
    //   await imagekit.deleteFile(ImgId);
    // }
    if (req.body.image.public_id == "null") {
      const result = await imagekit.upload({
        file: req.body.image.url,
        fileName: "pet_image",
        folder: "pets"
      });
      req.body.image = { public_id: [result.fileId], url: [result.url] };
    }
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
      const pet = await Pet.findById(petId);
      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
      }
      //retrieve current image ID
      const imgId = pet.image.public_id;

      // if (imgId[0] != "null" && imgId[0] != "") {
      //   await imagekit.deleteFile(ImgId);
      // }

      const petrm = await Pet.findByIdAndDelete(petId);

      res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};