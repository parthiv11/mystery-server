const express = require("express");
const { getRandomPokemonName, getPokemonMedia } = require("./poke_utils");
const { queryModel } = require("./mdb_con");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 4000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/new_game", (req, res) => {
  getRandomPokemonName().then((pokemonName) => {
    res.json({ pokemonName: pokemonName });
  });
});


app.post("/ask_question", (req, res) => {
  const question = req.body.question;
  const pokemonName = req.body.pokemonName;

  queryModel(pokemonName, question).then((response) => {
    if(response['answer'].toLowerCase().includes('yes'))
      response['type'] = 'yes';
    else if(response['answer'].toLowerCase().includes('no'))
      response['type'] = 'no';
    else if (response['answer'].toLowerCase().includes('congratulations'))
      response['type'] = 'congratulations';
    else
      response['type'] = 'neutral'; 

    res.json(response);
  });
});

app.get("/get_media/:pokemonName/", async (req, res) => {
  const { pokemonName } = req.params;

  try {
    const mediaJson = await getPokemonMedia(pokemonName);
    res.json(mediaJson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
