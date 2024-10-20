const express = require("express");
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const moment = require("moment");
const cors = require("cors");
require("dotenv").config();

const database = require("./config/database");
const systemConfig = require("./config/system");
const routeAdmin = require("./routes/admin/index.route");


database.connect();

const app = express();
const port = process.env.PORT;
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
const corsOptions = {
  origin: 'dacn-steel.vercel.app', // Your frontend URL
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());

// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// Routes
routeAdmin(app);

app.get("*", (req, res) => {
  res.send("404 Not Found");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
