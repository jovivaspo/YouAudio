const { readFile, writeFile } = require("fs/promises");
const path = require("path");
const fs = require("fs");
const getTrending = require("./getTrending");
const categories = require("../helpers/categories");
const config = require("../config");

const createFile = async (category) => {
  try {
    const data = await getTrending(config[category]);
    data.createdAt = new Date();
    await writeFile(
      path.resolve(__dirname, `../videos/${category}.json`),
      JSON.stringify(data)
    );
  } catch (error) {
    console.log(error);
    console.log("Error al crear archivo json");
  }
};

const checkVideos = async () => {
  /*SE COMPRUEBA SOLO SI EXISTE EL TRENDING PRINCIPAL*/
  const keys = Object.keys(categories);
  if (!fs.existsSync(path.resolve(__dirname, "../videos/trending.json"))) {
    console.log("El archivo no existe, se creará a continuación...");
    await Promise.all(
      keys.map(async (key) => {
        await createFile(key);
      })
    );
    return console.log("Archivos creados");
  }

  const file = await readFile(
    path.resolve(__dirname, "../videos/trending.json"),
    "utf-8"
  );

  const fileJson = JSON.parse(file);
  const hours =
    (new Date().getTime() - new Date(fileJson.createdAt).getTime()) / 3600000;

  console.log(hours);

  if (hours < 24) return console.log("No han pasado 24 horas");

  await Promise.all(
    keys.map(async (key) => {
      await createFile(key);
    })
  );
  return console.log("Archivos actualizados");
};

module.exports = checkVideos;
