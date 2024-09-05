const Product = require("../models/product.model");
module.exports.addProduct = async (req, res) => {
  console.log(req.body);
  // const { name, stock, brand, category, price, discount, description, status, image } = req.body;
  // const discountReal = discount || "0%";
  // const descriptionReal = description || "Không có mô tả";
  // const imageReal = image || ["https://res.cloudinary.com/dzm879qpm/image/upload/v1724509562/defautProduct_mlmwsw.png"];
  // const statusReal = status || "Hoạt động";
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
  console.log("Update Product");
  const { id } = req.params;
  const { name, stock, category, price, discount, description, status, image } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, stock, category, price, discount, description, status, image },
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