const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send('Boat Rentals');
});

router.use('/owners', require('./owners')); 
router.use('/boats', require('./boats')); 

module.exports = router;
