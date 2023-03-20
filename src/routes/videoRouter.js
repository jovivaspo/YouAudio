const { Router } = require("express");
const videoController = require("../controllers/videoController");

const router = Router();

router.get("/search/:q", videoController.search);

router.get("/category/:category", videoController.category);

router.get("/channel/:id", videoController.channel);

router.get("/playlist/:name", videoController.playlist);

router.get("/info/:id", videoController.getInfoVideo);

router.get("/:id", videoController.getAudio);

module.exports = router;
