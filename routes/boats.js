const express = require('express');
const router = express.Router();
const boatController = require('../controllers/boats');
const { boatValidationRules, validate } = require('../utils/boatValidator.js');
const { isAuthenticated } = require('../utils/authenticate.js')


//list all Boats
router.get('/', boatController.getAll);
//list Boat by id
router.get('/:id', boatController.getById);
//create new Boat
router.post('/', isAuthenticated, boatValidationRules(), validate, boatController.createBoat);
//update Boat by id
router.put('/:id', isAuthenticated, boatValidationRules(), validate, boatController.updateBoat);
router.delete('/:id', isAuthenticated, boatController.deleteBoat)

module.exports = router;
