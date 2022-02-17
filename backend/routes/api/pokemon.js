const express = require('express');
const asyncHandler = require('express-async-handler');

//require models
const { Pokemon, Item } = require('../../db/models');
//utility functions can be called using PokemonRepository.nameofFunction
const PokemonRepository = require('../../db/pokemon-repository');
const { types } = require('../../db/models/pokemonType');

const { randomItemImage } = require('./utils');

const pokemonValidations = require('../../validations/pokemon');
const itemValidations = require('../../validations/items');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async function (_req, res) {
    console.log(PokemonRepository.getItem());
    const pokemon = await Pokemon.findAll();
    return res.json(pokemon);
  })
);

router.post(
  '/',
  pokemonValidations.validateCreate,
  asyncHandler(async function (req, res) {
    const details = req.body;
    details.items = [...PokemonRepository.generateItems()];

    const pokemon = await Pokemon.create(details, { include: ['items'] });
    return res.redirect(`${req.baseUrl}/${pokemon.id}`);
  })
);

router.put(
  '/:id',
  pokemonValidations.validateUpdate,
  asyncHandler(async function (req, res) {
    const id = req.body.id;
    delete req.body.id;
    await Pokemon.update(req.body, {
      where: { id },
      returning: true,
      plain: true,
    });

    const pokemon = await Pokemon.scope('detailed').findByPk(id);

    return res.json(pokemon);
  })
);

router.get(
  '/types',
  asyncHandler(async function (_req, res) {
    return res.json(types);
  })
);

router.get(
  '/:id',
  asyncHandler(async function (req, res) {
    const id = +req.params.id;
    const pokemon = await Pokemon.scope('detailed').findByPk(id);
    return res.json(pokemon);
  })
);

router.get(
  '/:id/items',
  asyncHandler(async function (req, res) {
    const items = await Item.findAll({
      where: {
        pokemonId: +req.params.id,
      },
    });

    return res.json(items);
  })
);

router.post(
  '/:id/items',
  itemValidations.validateCreate,
  asyncHandler(async function (req, res) {
    if (!req.body.imageUrl) req.body.imageUrl = randomItemImage();
    const newItem = await Item.create({
      ...req.body,
      pokemonId: +req.params.id,
    });

    const item = await Item.findByPk(newItem.id);

    return res.json(item);
  })
);

module.exports = router;
