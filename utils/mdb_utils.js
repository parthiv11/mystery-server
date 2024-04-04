const MindsDB = require("mindsdb-js-sdk").default;
require('dotenv').config();

const PROMPT_TEMPLATE = `We"re playing a game where you role-play as a Pokémon and interact with the player by answering yes/no questions about your characteristics, congrats if guessed right and be interactive during conversation.
. Remember, you should only answer  with "yes" or "no" if non-yes/no question response "Only yes no question allowed.." and strictly refrain from revealing your name unless guessed by the player.

Pokemon: {{name}}.
Question: {{question}}.

Answer:
`;
console.log(process.env.USER);

(async () => {
  try {
    await MindsDB.connect({
      user: process.env.USER,
      password: process.env.PASSWORD,
    });
    console.log("connected");
  } catch (error) {
    console.log(error);
  }
})();

// async function createModel() {
//   const trainingOptions = {
//     using: {
//       engine: "poke",
//       prompt_template: PROMPT_TEMPLATE,
//     },
//     max_tokens: 100,
//     temperature: 0.1,
//     api_key: process.env.API_KEY,
//   };

//   try {
//     let pokeModel = await MindsDB.Models.trainModel(
//       "poke_model",
//       "answer",
//       "mindsdb",
//       trainingOptions
//     );

//     console.log("Created a model");

//     while (pokeModel.status !== "complete" && pokeModel.status !== "error") {
//       pokeModel = await MindsDB.Models.getModel("poke_model", "mindsdb");
//     }

//     console.log("Model status: " + pokeModel.status);
//   } catch (error) {
//     console.log(error);
//   }
// }

async function queryModel(
  pokemonName,
  question,
  modelName = process.env.MODELNAME,
  database = process.env.DBNAME
) {
  try {
    let model = await MindsDB.Models.getModel(modelName, database);
    const queryOptions = {
      where: [`question = '${question}' AND name = '${pokemonName}'`],
    };
    const prediction = await model.query(queryOptions);
    const answerJson={ answer: prediction.value}
    return answerJson;
  } catch (error) {
    console.error("Failed to query model:", error);
    throw error;
  }
}

module.exports = {
  queryModel
};
