const News = require("../models/news.model");
const cloudinary = require("../config/cloudinary");
module.exports.addNews = async (req, res) => {

  try {
    console.log(1);
    console.log(req.body);
    if(req.body.image.public_id == "null"){
      const result = await cloudinary.uploader.upload(req.body.image.url, {
        folder: "news",
        // width: 300,
        // crop: "scale"
      })
      req.body.image = { public_id: [result.public_id], url: [result.secure_url] };
    }
    else{
      req.body.image = { public_id: ["null"], url: ["https://res.cloudinary.com/dzm879qpm/image/upload/v1724509562/defautProduct_mlmwsw.png"] };
    }
    console.log(req.body);
    const news = await News.create(req.body);
    console.log(2);
    res.status(201).json({ news });
    console.log(news);
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.getListNews = async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json({ news });
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.getNewsById = async (req, res) => {
  const { id } = req.params;
  try {
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }
    res.status(200).json({ news });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.updateNews = async (req, res) => {
  console.log("Update News");
  console.log(req.body);
  const { id } = req.params;
  const currentNews = await News.findById(id);
  const ImgId = currentNews.image.public_id;
  try {
    if (ImgId[0] != "null" || !currentNews) {
      await cloudinary.uploader.destroy(ImgId);
    }
    if(req.body.image.public_id == "null"){
    const result = await cloudinary.uploader.upload(req.body.image.url, {
      folder: "news",
      // width: 300,
      // crop: "scale"
    })
    req.body.image = { public_id: [result.public_id], url: [result.secure_url] };
    }
    const news = await News.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }
    res.status(200).json({ news });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.deleteNews = async (req, res) => {
  try {
      const petId = req.params.id;
      const news = await News.findById(petId);
      if (!news) {
        return res.status(404).json({ message: 'News not found' });
      }
      //retrieve current image ID
      const imgId = news.image.public_id;
      if (imgId[0] != "null" && imgId[0] != "") {
        await cloudinary.uploader.destroy(imgId);
      }

      const petrm = await News.findByIdAndDelete(petId);

      res.status(200).json({ message: 'News deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};