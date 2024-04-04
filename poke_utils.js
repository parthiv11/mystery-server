function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPokemonName() {
  const randomPokemonId = getRandomInt(1, 30);

  return fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch Pokémon data");
      }
      return response.json();
    })
    .then((data) => {
      const pokemonName = data.name;
      return pokemonName;
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      return null;
    });
}

async function getPokemonMedia(pokemonName) {
  const pokemonData = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
  );
  if (!pokemonData.ok) {
    throw new Error("Failed to fetch Pokémon data");
  }
  const pokemonJson = await pokemonData.json();

  return {
    img: pokemonJson["sprites"]["front_default"],
    ogg: pokemonJson["cries"]["latest"],
  };
}

module.exports = {
  getRandomPokemonName,
  getPokemonMedia
};
