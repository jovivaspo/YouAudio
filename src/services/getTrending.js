const config = require("../config");

const getTrending = async (id) => {
  let uri;
  if (!id) {
    uri =
      "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&regionCode=es&chart=mostPopular&maxResults=16&key=" +
      config.API_KEY_YT;
  } else {
    uri = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&regionCode=es&chart=mostPopular&maxResults=16&videoCategoryId=${id}&key=${config.API_KEY_YT}`;
  }
  try {
    const results = await fetch(uri);
    const json = await results.json();
    return json;
  } catch (error) {
    console.log(error);
    console.log("Error al realizar la petición");
  }
};

module.exports = getTrending;
