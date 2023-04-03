const express = require("express");
const cors = require("cors");
const config = require("./config");
const checkVideos = require("./services/checkVideos");
const path = require("path")

const app = express();

//CHECKING LAST VIDEOS
checkVideos();


//SETTINGS
app.set("port", config.PORT || 8001);

//MIDDLEWARE
app.use(
  cors({
    origin: ["http://localhost:8000", "https://you-audio.vercel.app", "https://you-audio-git-main-jovivaspo.vercel.app","https://you-audio-2tmucbq7i-jovivaspo.vercel.app"],
  })
);

app.use(express.json());
app.use(express.static("public"));

//ROUTES
app.use("/api/video", require("./routes/videoRouter"));


//PUBLIC
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'), function(err) {
   if (err) {
     res.status(500).send(err)
   }
 })
 })

module.exports = app;
