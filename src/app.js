const express = require("express");
const cors = require("cors");
const config = require("./config");
const checkVideos = require("./services/checkVideos");

const app = express();

//ADMIN
checkVideos();

//SETTINGS
app.set("port", config.PORT || 8001);

//MIDDLEWARE
app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:5173"],
  })
);

app.use(express.json());

//ROUTES
app.use("/api/video", require("./routes/videoRouter"));

//HANDLER ERRORS

module.exports = app;
