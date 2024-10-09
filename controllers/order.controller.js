const Order = require("../models/order.model");
const Account = require("../models/account.model");
module.exports.addOrder = async (req, res) => {
  console.log(req.body);
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ order });
    console.log(order);
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.cartToOrder = async (req, res) => {
  // API body: {user_id, product_list: [{product_id, quantity, price, discount_price}]',
  // payment_method, voucher_id, total_price}
  try {
    const account = await Account.findById(req.body.user_id);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    const order = await Order.create({
      user_id: req.body.user_id,
      order_status: "Chưa xử lý",
      order_address: account.address,
      phone_number: account.phone,
      order_email: account.email,
      product_list: req.body.product_list,
      order_date: new Date(),
      delivery_date: null,
      payment_method: req.body.payment_method,
      employee_id: null,
      voucher_id: req.body.voucher_id,
      total_price: req.body.total_price
    });
    res.status(201).json({ order });
    console.log(order);
  } catch (error) {
    res.status(400).json({ error });
  }
};
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