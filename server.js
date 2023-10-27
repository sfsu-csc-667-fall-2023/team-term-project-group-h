require("dotenv").config();
// let's print the env variables one by one
for (let key in process.env) {
  console.log(`${key}: ${process.env[key]}`);
}

const express = require("express");
const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const rootRoutes = require("./backend/routes/root");
const PORT = process.env.PORT || 3000;
const testRoutes = require("./backend/routes/test/index.js"); 


const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV == "development") {
  const livereload = require("livereload");
  const connectLiveReload = require("connect-livereload");
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, "backend", "static"));
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
}, 100); });
  app.use(connectLiveReload());
};


app.set("views", path.join(__dirname, "backend", "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "backend", "static")));
console.log(__dirname + "/backend/static");
app.use("/", rootRoutes);
app.use("/test", testRoutes);
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


app.use((request, response, next) => {
  next(createError(404));
});