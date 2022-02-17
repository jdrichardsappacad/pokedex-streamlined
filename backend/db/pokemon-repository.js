/* THIS FILE IS MAINLY TO STORE UTILITY FUNCTIONS, NOT TO MAKE DB CALLS */

//  ***Use of faker not allowed on Solo React Project it id deprecated***
const { commerce } = require('faker');
const { Pokemon } = require('./models');

function random100() {
  return Math.floor(Math.random() * 100) + 1;
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

// generator docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator
//  ***Use of faker not allowed on Solo React Project***
function* generateItems() {
  for (let i = 0; i < 3; i += 1) {
    yield {
      name: commerce.productName(),
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

async function battle(allyId, opponentId) {
  const ally = await Pokemon.scope('ally').findByPk(allyId);
  const opponent = await Pokemon.scope('opponent').findByPk(opponentId);
  if (!ally) throw new Error('Ally Pokemon not found');
  if (!opponent) throw new Error('Opponent Pokemon not found');

  const minCaptureRate = 30;
  let attackDiff = ally.attack - opponent.defense;
  if (attackDiff < minCaptureRate) attackDiff = minCaptureRate;

  const randomNum = Math.random() * 100;

  if (randomNum <= attackDiff) {
    opponent.captured = true;
    await opponent.save();
    return await Pokemon.findByPk(opponent.id);
  }

  return await Pokemon.findByPk(opponent.id);
}

module.exports = {
  random,
  generateItems,
};
