const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/owners');
const { ownerValidationRules, validate } = require('../utils/ownerValidator.js');
const { isAuthenticated } = require('../utils/authenticate.js')

//list all owners
router.get('/', ownerController.getAll);
//list owner by id
router.get('/:id', ownerController.getById);
//create new owner
router.post('/', isAuthenticated, ownerValidationRules(), validate, ownerController.createOwner);
//update owner by id
router.put('/:id',  isAuthenticated, ownerValidationRules(), validate, ownerController.updateOwner);
router.delete('/:id',  isAuthenticated, ownerController.deleteOwner)

module.exports = router;
