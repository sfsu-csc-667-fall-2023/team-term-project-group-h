const path = require("path");
const { createServer } = require("http");

const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const requestTime = require("./middleware/request-time");
const morgan = require("morgan");
const session = require("express-session");
const { Server } = require("socket.io");

const {
  viewSessionData,
  sessionLocals,
  isAuthenticated,
} = require("./middleware/");

const express = require("express");
require("dotenv").config();
const app = express();
const httpServer = createServer(app);

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

const sessionMiddleware = session({
  store: new (require("connect-pg-simple")(session))({
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: { secure: process.env.NODE_ENV !== "development" },
  saveUninitialized: false,
});

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // trust first proxy
}

app.use(sessionMiddleware);

if (process.env.NODE_ENV === "development") {
  app.use(viewSessionData);
}

app.use(sessionLocals);
/*
* Sockets have traditionally been the solution around which most real-time chat systems are architected, 
* providing a bi-directional communication channel between a client and a server.
*/
const io = new Server(httpServer);
io.engine.use(sessionMiddleware);
app.set("io", io);

// every time a new socket connects, it will be added to the socket.io server
io.on("connection", (socket) => {
  socket.join(socket.request.session.id);
  console.log("a user connected to socket.io");
  console.log(`socket.request.session.id: ${socket.request.session.id}`);
  if (socket.handshake.query !== undefined) {
    socket.join(socket.handshake.query.id);
  }
});

const Routes = require("./routes");

app.use("/", Routes.root);
app.use("/login", Routes.authentication);
app.use("/game", isAuthenticated, Routes.game, Routes.chat);
app.use("/lobby", isAuthenticated, Routes.lobby, Routes.chat);
app.use("/waiting", isAuthenticated, Routes.waiting, Routes.chat);

const PORT = process.env.PORT || 3000;

// these lines below are telling the server to listen for requests on port 3000 and to console.log a message when the server is ready 
httpServer.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.use((_request, _response, next) => {
  next(createError(404));
});
