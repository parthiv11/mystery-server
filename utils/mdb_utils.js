const MindsDB = require("mindsdb-js-sdk").default;
const jwt = require("jsonwebtoken");

require("dotenv").config();

const MODEL_NAME = "poke_model";
const PROJECT_NAME = "poke";
const ENGINE = "poke_engine";
const INTEGRATION = "openai";
const PROMPT_TEMPLATE = `We"re playing a game where you role-play as a Pokémon and interact with the player by answering yes/no questions about your characteristics, say "Congratulation, you won" if guessed right and be interactive during conversation.
. Remember, you should only answer  with "yes" or "no" with 5-10 interactive and humourous words as per question if non-yes/no question response "Only yes no question allowed.." and strictly refrain from revealing your name unless guessed by the player.

Pokemon: {{name}}.
Question: {{question}}.

Answer:
`;

async function connectMindsDB(username, password) {
  try {
    await MindsDB.connect({
      user: username,
      password: password,
    });
  } catch (error) {
    console.error("Failed to connect to MindsDB:", error);
    throw error;
  }
}

async function createMlEngine(engineName, integration, API_KEY) {
  try {
    await MindsDB.SQL.runQuery(
      `CREATE ML_ENGINE ${engineName} FROM ${integration} USING api_key='${API_KEY}';`
    );
  } catch (error) {
    console.error("Failed to create ML Engine:", error);
    throw error;
  }
}

async function createModel(API_KEY) {
  try {
    await createMlEngine(ENGINE, INTEGRATION, API_KEY);
    await MindsDB.SQL.runQuery(`CREATE PROJECT ${PROJECT_NAME};`);

    const trainingOptions = {
      using: {
        engine: ENGINE,
        prompt_template: PROMPT_TEMPLATE,
      },
      max_tokens: 100,
      temperature: 0.1,
      // api_key: API_KEY,
    };
    let model = await MindsDB.Models.trainModel(
      MODEL_NAME,
      "answer",
      PROJECT_NAME,
      trainingOptions
    );

    while (model.status !== "complete" && model.status !== "error") {
      model = await MindsDB.Models.getModel(modelName, projectName);
    }
  } catch (error) {
    console.error("Failed to create model:", error);
    throw error;
  }
}

async function queryModel(pokemonName, question, auth) {
  try {
    await MindsDB.connect({ user: auth["user"], password: auth["password"] });

    let model = await MindsDB.Models.getModel(MODEL_NAME, PROJECT_NAME);
    if (!model) {
      await createModel(auth["api_key"]);
      model = await MindsDB.Models.getModel(modelName, projectName);
    }
    const queryOptions = {
      where: [`question = '${question}' AND name = '${pokemonName}'`],
    };
    const prediction = await model.query(queryOptions);
    const answerJson = { answer: prediction.value };
    return answerJson;
  } catch (error) {
    console.error("Failed to query model:", error);
    throw error;
  }
}

async function generateToken(user, password, api_key) {
  await connectMindsDB(user, password);

  const secretKey = process.env.SECRET_KEY;
  const payload = {
    user: user,
    password: password,
    api_key: api_key,
  };
  const token = jwt.sign(payload, secretKey);

  return token;
}

module.exports = {
  queryModel,
  generateToken,
};
