const youtube = require("scrape-youtube");
const { readFile } = require("fs/promises");
const path = require("path");
const ytpl = require("ytpl");

const videoController = {};

videoController.search = async (req, res, next) => {
  try {
    const { q } = req.params;

    if (!q) {
      return res.status(400).json({ error: "Término de búsqueda no indicado" });
    }

    const result = await youtube.search(q);

    if (!result || result.videos.length === 0) {
      const error = new Error("Error en la búsqueda...");
      res.status(500);
      return next(error);
    }

    return res.status(200).json({ videos: result.videos });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error en la búsqueda" });
  }
};

videoController.category = async (req, res, next) => {
  try {
    const { category } = req.params;
    console.log(category);
    const file = await readFile(
      path.resolve(__dirname, `../videos/${category}.json`),
      "utf8"
    );
    const fileJson = JSON.parse(file);
    return res.json({ category, results: fileJson.items });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error en la búsqueda" });
  }
};

videoController.channel = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Petición incorrecta" });
  }

  try {
    const channel = await ytpl(id);

    if (!channel) return res.status(404).json({ error: "No hay resultados" });

    return res.json({ channel });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error en la búsqueda" });
  }
};

videoController.playlist = async (req, res, next) => {
  try {
    const { name } = req.params;

    const page = await fetch(`https://www.youtube.com/@${name}/playlists`);

    const html = await page.text();

    const regex = /"playlistId":"([^"]+)"/g;

    const matches = html.match(regex);

    if (matches.length === 0 || !matches) {
      return res.status(404).json({ error: "No se han encontrado playlists" });
    }

    const listOfIds = matches.map((el) => {
      const mats = el.match(/"playlistId":"([^"]+)"/);
      return mats[1].split('"').pop();
    });

    const ids = [...new Set(listOfIds)];

    const playlists = (
      await Promise.all(
        ids.map(async (id) => {
          try {
            return await ytpl(id);
          } catch (error) {
            console.log(error);
          }
        })
      )
    ).filter((el) => el);

    // console.log(playlists);

    if (playlists.length === 0) {
      return res.status(404).json({ error: "No se han encontrado playlists" });
    }

    return res.json({ playlists });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error en la búsqueda" });
  }
};

module.exports = videoController;
