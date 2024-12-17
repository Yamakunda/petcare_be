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
    console.log(req.query);
    var brandlist = []
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * itemsPerPage;
    const { category, minPrice, maxPrice, sortBy, sortOrder, brand } = req.query;
    const query = {};

    // Build sort object
    const sortOptions = {};
    const validSortFields = ['name', 'price', 'discount_price'];
    const validSortOrders = ['asc', 'desc'];
    
    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder)) {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } 

    if (category) {
      query.category = category;
    }
    if (brand) {
      query.brand = brand;
    }

    if (minPrice || maxPrice) {
      query.discount_price = {};
      if (minPrice) query.discount_price.$gte = parseInt(minPrice);
      if (maxPrice) query.discount_price.$lte = parseInt(maxPrice);
    }

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(itemsPerPage);
      
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    if(category){
      brandlist = await Product.distinct('brand', {category: category});
    }
    res.status(200).json({ 
      products,
      pagination: {
        currentPage: page,
        totalProducts,
        totalPages,
        itemsPerPage
      },
      sort: {
        sortBy: sortBy || 'name',
        sortOrder: sortOrder || 'asc'
      },
      brandlist: brandlist
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.getProductIntro = async (req, res) => {
  try {
    const categories = [
      "Nhà thú cưng",
      "Đồ chơi cho thú cưng", 
      "Thức ăn thú cưng",
      "Đồ dùng tắm gội",
      "Đồ dùng thú y",
      "Đồ dùng vệ sinh"
    ];

    // Get top products by category
    const topProductsByCategory = await Promise.all(
      categories.map(async (category) => {
        const products = await Product.aggregate([
          {
            $match: {
              category: category
            }
          },
          {
            $sort: { rating: -1 }
          },
          {
            $limit: 5
          }
        ]);
        return { category, products };
      })
    );

    // Get overall top products
    const topProductOverall = await Product.aggregate([
      {
        $sort: { rating: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Format response
    const response = {
      ...topProductsByCategory.reduce((acc, { category, products }) => ({
        ...acc,
        [category]: products
      }), {}),
      overall: topProductOverall
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
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