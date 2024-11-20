const systemConfig = require("../../config/system");
const productRoutes = require("./product.route");
const voucherRoutes = require("./voucher.route");
const petRoutes = require("./pet.route");
const rescueRequestRoutes = require("./rescueRequest.route");
const appointmentRoutes = require("./appointment.route");
const adoptRoutes = require("./adopt.route");
const orderRoutes = require("./order.route");
const newsRoutes = require("./news.route");
const dashboardRoutes = require("./dashboard.route");
const authRoutes = require("./auth.route");
const accountRoutes = require("./account.route");
const reviewRoutes = require("./review.route");
const cartRoutes = require("./cart.route");
const otpRoutes = require("./otp.route");
const paymentRoutes = require("./payment.route")
const notificationRoutes = require("./notification.route");
const serviceRoutes = require("./service.route");
const test = require("./test");
module.exports = (app) => {
  app.use("/product", productRoutes);
  app.use("/voucher", voucherRoutes);
  app.use("/pet", petRoutes);
  app.use("/rescueRequest", rescueRequestRoutes);
  app.use("/appointment", appointmentRoutes);
  app.use("/adopt", adoptRoutes);
  app.use("/order", orderRoutes);
  app.use("/news", newsRoutes);
  app.use("/dashboard", dashboardRoutes);
  app.use("/account", accountRoutes);
  app.use("/review", reviewRoutes);
  app.use("/auth", authRoutes);
  app.use("/cart", cartRoutes);
  app.use("/otp", otpRoutes);
  app.use("/payment", paymentRoutes)
  app.use("/notification", notificationRoutes);
  app.use("/service", serviceRoutes);
  app.use("/test", test);

};