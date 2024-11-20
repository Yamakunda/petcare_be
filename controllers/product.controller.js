const Product = require("../models/product.model");
const Review = require("../models/review.model");
const diacritics = require('diacritics');
const imagekit = require("../config/imagekit");

module.exports.addProduct = async (req, res) => {
  try {
    if (req.body.image.public_id === "null") {
      const result = await imagekit.upload({
        file: req.body.image.url,
        fileName: "product_image",
        folder: "products"
      });
      req.body.image = { public_id: [result.fileId], url: [result.url] };
    } else {
      req.body.image = { public_id: ["null"], url: ["https://ik.imagekit.io/yamakun/No_Image_Available.jpg?updatedAt=1731058703734"] };
    }

    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports.getListProductUser = async (req, res) => {
  try {
    const products = await Product.find({status: "active"});
    res.status(200).json({ products });
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.getListProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const currentProduct = await Product.findById(id);
  const ImgId = currentProduct.image.public_id;
  try {
    // if (ImgId[0] != "null" || !currentProduct) {
    //   await imagekit.deleteFile(ImgId);
    // }
    if (req.body.image.public_id == "null") {
      const result = await imagekit.upload({
        file: req.body.image.url,
        fileName: "product_image",
        folder: "products"
      });
      req.body.image = { public_id: [result.fileId], url: [result.url] };
    }

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    //retrieve current image ID
    const imgId = product.image.public_id;
    // if (imgId[0] != "null" && imgId[0] != "") {
    //   await imagekit.deleteFile(imgId);
    // }
    // Find the product by ID and delete it

    const rmproduct = await Product.findByIdAndDelete(productId);
    const rmreview = await Review.deleteMany({ product_id: productId });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
module.exports.searchProductByName = async (req, res) => {
  const { name } = req.params; // Use req.params to get name from the URL
  try {
    const normalizedSearchTerm = diacritics.remove(name);
    const allProducts = await Product.find(); // Retrieve all products
    const filteredProducts = allProducts.filter(product =>
      diacritics.remove(product.name).toLowerCase().includes(normalizedSearchTerm.toLowerCase())
    ).slice(0, 5); // Limit to the first 5 matching products
    res.status(200).json({ products: filteredProducts });
  } catch (error) {
    res.status(400).json({ error });
  }
};