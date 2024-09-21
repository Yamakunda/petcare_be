const authRoutes = require("./auth.route");
const accountRoutes = require("./account.route");
const reviewRoutes = require("./review.route");
const cartRoutes = require("./cart.route");
const otpRoutes = require("./otp.route");
const test = require("./test");
module.exports = (app) => {
app.use("/account", accountRoutes);
app.use("/review", reviewRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/otp", otpRoutes);

app.use("/test", test);
};
