const path = require("path");
const rootRoutes = require("./routes/root");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const requestTime = require("./middleware/request-time");
const testRoute = require("./routes/test/index.js");
const morgan = require("morgan");

const express = require("express");
require("dotenv").config();
const app = express();

app.use(morgan("dev"));
app.use(requestTime);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "static")));

if (process.env.NODE_ENV == "development") {
  const livereload = require("livereload");
  const connectLiveReload = require("connect-livereload");
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, "backend", "static"));
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
  app.use(connectLiveReload());
}

app.use("/", rootRoutes);
app.use("/test", testRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.use((request, response, next) => {
  next(createError(404));
});
