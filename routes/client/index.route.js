const authRoutes = require("./auth.route");
const test = require("./test");
module.exports = (app) => {

app.use("/auth", authRoutes);
app.use("/test", test);
};
