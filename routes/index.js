const router = require('express').Router();
const passport = require('passport');

router.get('/', (req, res, next) => {
    //res.send('Boat Rentals');//
    res.redirect('api-docs')
});

//not sure about this ./swagger tied to root
//router.use('/', require('./swagger'));
router.use('/owners', require('./owners')); 
router.use('/boats', require('./boats')); 

//login/logout
router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function (req, res, next) {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router;
