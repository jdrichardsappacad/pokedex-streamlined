const express = require('express');
const asyncHandler = require('express-async-handler');
const { Item } = require('../../db/models');

const itemValidations = require('../../validations/items');

const router = express.Router();

router.put(
  '/:id',
  itemValidations.validateUpdate,
  asyncHandler(async function (req, res) {
    const id = req.body.id;
    delete req.body.id;

    await Item.update(req.body, {
      where: { id },
      returning: true,
      plain: true,
    });
    const item = Item.findByPk(id);

    return res.json(item);
  })
);

router.delete(
  '/:id',
  asyncHandler(async function (req, res) {
    const item = await Item.findByPk(req.params.id);
    if (!item) throw new Error('Cannot find item');

    await Item.destroy({ where: { id: item.id } });
    return res.json({ id: item.id });
  })
);

module.exports = router;
