const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Account = require("../models/account.model");
const Cart = require("../models/cart.model");
const moment = require("moment");
module.exports.addOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ order });
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.cartToOrder = async (req, res) => {
  // API body: {user_id, product_list: [{product_id, quantity, price, discount_price}]',
  // payment_method, voucher_id, total_price}
  try {
    console.log("cart to order");
    const account = await Account.findById(req.body.user_id);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    const order = await Order.create({
      user_id: req.body.user_id,
      order_status: (req.body.payment_method == "Trực tiếp") ? "Chờ xử lý" : "Chờ thanh toán",
      order_address: account.address,
      phone_number: account.phone,
      order_email: account.email,
      product_list: req.body.product_list,
      order_date: new Date(),
      delivery_date: new Date(),//Chỉnh sửa khi biết ngày giao hàng
      payment_method: req.body.payment_method,
      payment_id: "Chưa có",
      payment_url: "Chưa có",
      employee_id: "Chưa có",
      voucher_id: req.body.voucher_id,
      total_price: req.body.total_price
    });
    // Generate the payment_id based on the order_id
    order.payment_id = `${moment().format('YYMMDD')}_${order._id}`;
    await order.save();
    const cart = await Cart.findOne({ user_id: req.body.user_id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    // Remove products in order.product_list from cart.product_list
    const orderProductIds = order.product_list.map(orderItem => orderItem.product_id.toString());

    cart.product_list = cart.product_list.filter(cartItem => !orderProductIds.includes(cartItem.product_id.toString()));
    await cart.save();
    res.status(201).json({ order });

  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ order_status: 1, createdAt: -1 })
      .populate('user_id', 'userName'); // Populate userName from Account using user_id
    res.status(200).json({ orders });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.getListOrder = async (req, res) => {
  const { id } = req;
  try {
    const orders = await Order.find({ user_id: id }).sort({ createdAt: -1 });
    const ordersWithProductDetails = await Promise.all(orders.map(async (order) => {
      const productListWithDetails = await Promise.all(order.product_list.map(async (item) => {
        const product = await Product.findById(item.product_id);
        return {
          ...item._doc,
          product_name: product ? product.name : null,
          product_image: product ? product.image.url[0] : null
        };
      }));
      return {
        ...order._doc,
        product_list: productListWithDetails
      };
    }));

    res.status(200).json({ orders: ordersWithProductDetails });
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id).populate('user_id', 'userName');;
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order.employee_id !== "Chưa có") {
      const employee = await Account.findById(order.employee_id, 'userName');0
      order.employee_id = employee.userName;
    }
    const productListWithDetails = await Promise.all(order.product_list.map(async (item) => {
      const product = await Product.findById(item.product_id);
      return {
        ...item._doc,
        product_name: product ? product.name : null,
        product_image: product ? product.image.url[0] : null
      };
    }));

    const orderWithProductDetails = {
      ...order._doc,
      product_list: productListWithDetails
    };

    res.status(200).json({ order: orderWithProductDetails });
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

module.exports.prepareOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Iterate over each product in the order
    for (const item of order.product_list) {
      const product = await Product.findById(item.product_id);
      if (product) {
        product.stock -= item.quantity; // Reduce stock by the quantity ordered
        product.purchased += item.quantity; // Increase purchased quantity by the same amount
        await product.save(); // Save the updated product
      }
    }
    order.order_status = "Đã xử lý";
    order.employee_id = req.id;
    await order.save();
    res.status(200).json({ message: "Order prepared and stock updated" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports.deliverOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    order.order_status = "Đã hoàn thành";
    await order.save();
    res.status(200).json({ message: "Order completed" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

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
module.exports.rebuyOrder = async (req, res) => {
  console.log("Rebuy Order");
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    const product_list = order.product_list;
    const cart = await Cart.findOne({ user_id: order.user_id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    for (const item of product_list) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        continue; // Skip to the next product if not found
      }
      const cartItem = {
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price,
        discount_price: product.discount_price
      };
      cart.product_list.push(cartItem);
    }
    await cart.save();
    res.status(200).json({ cart });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.cancelOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    order.order_status = "Đã hủy";
    await order.save();
    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ error });
  }
}
module.exports.confirmOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    order.order_status = "Đã xác nhận";
    await order.save();
    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ error });
  }
};
module.exports.deleteAllOrder = async (req, res) => {
  try {
    await Order.deleteMany();
    res.status(200).json({ message: "All orders deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};