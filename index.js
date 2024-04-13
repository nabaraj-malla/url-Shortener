const express = require("express");
const path = require("path");
const { connectMongoDb } = require("./connectMongo");
const cookieParser = require("cookie-parser");
const { restrictToLoggedInUserOnly, checkAuth } = require("./middlewares/auth");

const staticRouter = require("./routes/staticRouter");
const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8001;

// connection
connectMongoDb("mongodb://localhost:27017/short-url")
  .then(() => console.log("connected to mongoDb"))
  .catch(() => console.log("error in mongoDb connection"));

app.set("view engine", "ejs"); //for ejs
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/url", restrictToLoggedInUserOnly, urlRoute);
app.use("/", checkAuth, staticRouter);
app.use("/user", userRoute);

app.listen(PORT, () => console.log(`server started at PORT ${PORT}`));
