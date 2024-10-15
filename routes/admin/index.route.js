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


module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use("/product", productRoutes);  
  app.use("/voucher", voucherRoutes);
  app.use("/pet", petRoutes);
  app.use("/rescueRequest", rescueRequestRoutes);
  app.use("/appointment", appointmentRoutes);
  app.use("/adopt", adoptRoutes);
  app.use("/order", orderRoutes);
  app.use("/news", newsRoutes);
  app.use("/dashboard", dashboardRoutes);
  
};