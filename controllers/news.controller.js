const News = require("../models/news.model");
const imagekit = require("../config/imagekit");
module.exports.addNews = async (req, res) => {

  try {
    if (req.body.image.public_id === "null") {
      const result = await imagekit.upload({
        file: req.body.image.url,
        fileName: "news_image",
        folder: "news"
      });
      req.body.image = { public_id: [result.fileId], url: [result.url] };
    } else {
      req.body.image = { public_id: ["null"], url: ["https://ik.imagekit.io/yamakun/No_Image_Available.jpg?updatedAt=1731058703734"] };
    }
    const news = await News.create(req.body);
    res.status(201).json({ news });
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
  const { id } = req.params;
  const currentNews = await News.findById(id);
  const ImgId = currentNews.image.public_id;
  try {
     // if (ImgId[0] != "null" || !currentNews) {
    //   await imagekit.deleteFile(ImgId);
    // }
    if (req.body.image.public_id == "null") {
      const result = await imagekit.upload({
        file: req.body.image.url,
        fileName: "news_image",
        folder: "news"
      });
      req.body.image = { public_id: [result.fileId], url: [result.url] };
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
      // if (imgId[0] != "null" && imgId[0] != "") {
      //   await imagekit.deleteFile(ImgId);
      // }

      const petrm = await News.findByIdAndDelete(petId);

      res.status(200).json({ message: 'News deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};