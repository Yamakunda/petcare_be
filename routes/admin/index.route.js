const systemConfig = require("../../config/system");
const productRoutes = require("./product.route");
const voucherRoutes = require("./voucher.route");
const petRoutes = require("./pet.route");
module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use("/product", productRoutes);  
  app.use("/voucher", voucherRoutes);
  app.use("/pet", petRoutes);
};