const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
module.exports.addProductToCart = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  console.log(req.body);
  try {
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    let product_list = cart.product_list;
    const index = product_list.findIndex((product) => product.product_id === product_id);
    if (index !== -1) {
      // if (quantity === "0") {
      //   product_list.splice(index, 1);
      // }
      // else {
        // Product exists in the cart, update the quantity
        product_list[index].quantity += quantity;
        product_list[index].price = product.price;
        product_list[index].discount_price = product.discount_price;
      // }
    } else {
      // Product does not exist in the cart, add it
      if (quantity === "0") {
        return res.status(400).json({ error: "Quantity must be greater than 0" });
      } else {
        product_list.push({
          product_id: product_id,
          product_name: product.name,
          product_image: product.image.url[0], 
          quantity: quantity,
          price: product.price,
          discount_price: product.discount_price,
        });
      }
    }
    // Save the updated cart
    cart.product_list = product_list;
    await cart.save();

    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ error: "Update Cart error" });
  }
};
module.exports.adjustProductQuantity = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    let product_list = cart.product_list;
    const index = product_list.findIndex((product) => product.product_id === product_id);
    if (index === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }
    if (quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than 0" });
    }
    product_list[index].quantity = quantity;
    await cart.save();
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ error: "Adjust Product Quantity error" });
  }
};
module.exports.getCart = async (req, res) => {
  const { user_id } = req.params;
  try {
    const cart = await Cart.findOne({ user_id });
    const product_list = await Promise.all(cart.product_list.map(async (item) => {
      const product = await Product.findById(item.product_id);
      return {
        ...item._doc,
        product_name: product ? product.name : null,
        product_image: product ? product.image.url[0] : null
      };
    }));
    
    
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    const newCart = {
      ...cart._doc,
      product_list: product_list
    }
    console.log(newCart);
    res.status(200).json({cart: newCart});

    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ error: "Get Cart error" });
  }
}
module.exports.deleteProductFromCart = async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    let product_list = cart.product_list;
    const index = product_list.findIndex((product) => product.product_id === product_id);
    if (index === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }
    product_list.splice(index, 1);
    cart.product_list = product_list;
    await cart.save();
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ error: "Delete Product from Cart error" });
  }
}
module.exports.deleteAllItemsFromCart = async (req, res) => {
  const { user_id } = req.params; // Use req.params to get user_id from the URL
  try {
    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    cart.product_list = []; // Clear the product list
    await cart.save(); // Save the empty cart
    res.status(200).json({ message: "All items deleted from cart successfully" });
  } catch (error) {
    res.status(500).json({ error: "Delete all items from cart error" });
  }
};