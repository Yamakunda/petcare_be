const RescueRequest = require("../models/rescueRequest.model");
const cloudinary = require("../config/cloudinary");

module.exports.addRescue = async (req, res) => {

  try { 
    if(req.body.image.public_id == "null"){
      const result = await cloudinary.uploader.upload(req.body.image.url, {
        folder: "rescues",
        // width: 300,
        // crop: "scale"
      })
      req.body.image = { public_id: [result.public_id], url: [result.secure_url] };
    }
    else{
      req.body.image = { public_id: ["null"], url: ["https://res.cloudinary.com/dzm879qpm/image/upload/v1724509562/defautProduct_mlmwsw.png"] };
    }
    const rescue = await RescueRequest.create(req.body);
    res.status(201).json({ rescue });
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.getListRescue = async (req, res) => {
  try {
    const rescues = await RescueRequest.find().sort({ createdAt: -1 });
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
  const currentRescue = await RescueRequest.findById(id);
  const ImgId = currentRescue.image.public_id;
  
  // const { name, stock, category, price, discount, description, status, image } = req.body;
  try {
    if (ImgId[0] != "null" || !currentRescue) {
      await cloudinary.uploader.destroy(ImgId);
    }
    if(req.body.image.public_id == "null"){
    const result = await cloudinary.uploader.upload(req.body.image.url, {
      folder: "rescues",
      // width: 300,
      // crop: "scale"
    })
    req.body.image = { public_id: [result.public_id], url: [result.secure_url] };
    }
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
      const rescue_curr = await RescueRequest.findById(rescueId);
      if (!rescue_curr) {
        return res.status(404).json({ message: 'Rescue not found' });
      }
      //retrieve current image ID
      const imgId = rescue_curr.image.public_id;
      if (imgId[0] != "null" && imgId[0] != "") {
        await cloudinary.uploader.destroy(imgId);
      }
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