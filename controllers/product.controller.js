const Product = require("../models/product.model");
const cloudinary = require("../config/cloudinary");
module.exports.addProduct = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      folder: "products",
      width: 300,
      crop: "scale"
  })
    req.body.image = [result.secure_url];
    console.log(result);
  } catch (error) {
    res.status(400).json({error});
  }
  try {

    const product = await Product.create(req.body);
    res.status(201).json({ product });
    console.log(product);
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
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      folder: "products",
      width: 300,
      crop: "scale"
  })
    console.log(result);
    req.body.image = [result.secure_url];

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
      
      // Find the product by ID and delete it
      const product = await Product.findByIdAndDelete(productId);
      
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }
      
      res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};