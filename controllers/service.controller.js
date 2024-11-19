const imagekit = require("../config/imagekit");
const Service = require("../models/service.model");
module.exports.addService = async (req, res) => {
  try {
    if (req.body.image.public_id === "null") {
      const result = await imagekit.upload({
        file: req.body.image.url,
        fileName: "service_image",
        folder: "services"
      });
      req.body.image = { public_id: [result.fileId], url: [result.url] };
    } else {
      req.body.image = { public_id: ["null"], url: ["https://ik.imagekit.io/yamakun/No_Image_Available.jpg?updatedAt=1731058703734"] };
    }

    const service = await Service.create(req.body);
    res.status(201).json({ service });
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports.getListService = async (req, res) => {
  try {
    const services = await Service.find({status: "active"});
    res.status(200).json({ services });
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json({ service });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.updateService = async (req, res) => {
  const { id } = req.params;
  const currentService = await Service.findById(id);
  const ImgId = currentService.image.public_id;
  try {
    if (ImgId[0] != "null" || !currentService) {
      await imagekit.deleteFile(ImgId);
    }
    if (req.body.image.public_id == "null") {
      const result = await imagekit.upload({
        file: req.body.image.url,
        fileName: "service_image",
        folder: "services"
      });
      req.body.image = { public_id: [result.fileId], url: [result.url] };
    }

    const service = await Service.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json({ service });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Serviec not found' });
    }
    //retrieve current image ID
    const imgId = service.image.public_id;
    if (imgId[0] != "null" && imgId[0] != "") {
      await imagekit.deleteFile(imgId);
    }

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};