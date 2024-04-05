const express = require("express");
const { getRandomPokemonName, getPokemonMedia } = require("./utils/poke_utils");
const { queryModel, generateToken } = require("./utils/mdb_utils");

const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const app = express();
const port = 4000;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/login", async (req, res) => {
  const { email, password, api_key } = req.body;

  try {
    const token = await generateToken(email, password, api_key);
    res.json({ token:token });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(401).json({ message: "No account found or login failed" });
  }
});

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.VITE_SECRET_KEY, (err, auth) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.auth = auth;
    next();
  });
}

app.get("/new_game", (req, res) => {
  getRandomPokemonName().then((pokemonName) => {
    res.json({ pokemonName: pokemonName });
  });
});


app.post("/ask_question", authenticateToken, (req, res) => {
  const question = req.body.question;
  const pokemonName = req.body.pokemonName;
  const auth = req.auth;

  queryModel(pokemonName, question, auth).then((response) => {

    if (response['answer'].toLowerCase().includes('congratulation'))
      response['type'] = 'won';
    else if(response['answer'].toLowerCase().includes('yes'))
      response['type'] = 'yes';
    else if(response['answer'].toLowerCase().includes('no'))
      response['type'] = 'no';
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
  console.log(`Server is running on port https://localhost:${port}`);
});
