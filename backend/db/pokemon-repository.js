/* THIS FILE IS USED TO STORE UTILITY FUNCTIONS, NOT TO MAKE DB CALLS */

const items = require('./pokemon-items-data');

function random100() {
  return Math.floor(Math.random() * 100) + 1;
}

function getItem() {
  const random = Math.floor(Math.random() * 206);
  return items[random];
}

function randomImage() {
  const images = [
    '/images/pokemon_berry.svg',
    '/images/pokemon_egg.svg',
    '/images/pokemon_potion.svg',
    '/images/pokemon_super_potion.svg',
  ];
  const index = Math.floor(Math.random() * images.length);
  return images[index];
}

// this is a generator function
//docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator

function* generateItems() {
  for (let i = 0; i < 3; i += 1) {
    yield {
      name: getItem(),
      price: random100(),
      happiness: random100(),
      imageUrl: randomImage(),
    };
  }
}

async function random() {
  const pokemon = await Pokemon.scope(['random', 'opponent']).findAll();
  const weightedSum = pokemon.reduce((sum, { encounterRate }) => {
    return sum + Number(encounterRate);
  }, 0);
  let randomSum = Math.random() * weightedSum;
  let chosenId;
  for (let i = 0; i < pokemon.length; i++) {
    if (randomSum < pokemon[i].encounterRate) {
      chosenId = i;
      break;
    }
    randomSum -= pokemon[i].encounterRate;
  }
  return await Pokemon.findByPk(chosenId);
}

module.exports = {
  random,
  generateItems,
  getItem,
};
