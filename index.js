const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const moment = require("moment");
const cors = require("cors");
require("dotenv").config();

const database = require("./config/database");
const systemConfig = require("./config/system");
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

database.connect();

const app = express();
app.use(express.json());
const port = process.env.PORT;

app.use(cors({ origin: 'http://localhost:3000',credentials: true, }));
app.use(bodyParser.urlencoded({ extended: false }));

// Flash
// app.use(cookieParser("JHGJKLKLGFLJK"));
// app.use(session({ cookie: { maxAge: 60000 } }));
// app.use(flash());
// End Flash

// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// Routes
routeAdmin(app);
route(app);

app.get("*", (req, res) => {
  res.send("404 Not Found");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});