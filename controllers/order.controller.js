const Order = require("../models/order.model");
module.exports.addOrder = async (req, res) => {
  console.log(req.body);
  // const { name, stock, brand, category, price, discount, description, status, image } = req.body;
  // const discountReal = discount || "0%";
  // const descriptionReal = description || "Không có mô tả";
  // const imageReal = image || ["https://res.cloudinary.com/dzm879qpm/image/upload/v1724509562/defautOrder_mlmwsw.png"];
  // const statusReal = status || "Hoạt động";
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ order });
    console.log(order);
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.getListOrder = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ orders });
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.updateOrder = async (req, res) => {
  console.log("Update Order");
  const { id } = req.params;
  // const { name, stock, category, price, discount, description, status, image } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.deleteOrder = async (req, res) => {
  try {
      const orderId = req.params.id;
      
      // Find the order by ID and delete it
      const order = await Order.findByIdAndDelete(orderId);
      
      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }
      
      res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};