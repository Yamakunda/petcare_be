const authRoutes = require("./auth.route");
const accountRoutes = require("./account.route");
const test = require("./test");
module.exports = (app) => {
app.use("/account", accountRoutes);
app.use("/auth", authRoutes);
app.use("/test", test);
};
