const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/owners');
const { ownerValidationRules, validate } = require('../utils/ownerValidator.js');

//list all owners
router.get('/', ownerController.getAll);
//list owner by id
router.get('/:id', ownerController.getById);
//create new owner
router.post('/', ownerValidationRules(), validate, ownerController.createOwner);
//update owner by id
router.put('/:id', ownerValidationRules(), validate, ownerController.updateOwner);
router.delete('/:id', ownerController.deleteOwner)

module.exports = router;
