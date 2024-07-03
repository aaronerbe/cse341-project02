const router = require('express').Router();
const passport = require('passport');

//removing this so you can see the logged in or logged out message (see server.js)
//router.get('/', (req, res, next) => {
//    //#swagger.tags=['Root']
//    //#swagger.summary='api-docs redirect'
//    //#swagger.description='Currently Root is set to redirect to /api-docs for convenience'
//    res.send('Boat Rentals');
//    //res.redirect('api-docs')
//});

//not sure about this ./swagger tied to root
router.use('/', require('./swagger'));
router.use('/swagger', require('./swagger'));
router.use('/owners', require('./owners')); 
router.use('/boats', require('./boats')); 


//login/logout
router.get(
    //#swagger.tags=['Authentication']
    //#swagger.summary='Authenticate User using Github'
    //#swagger.description='This endpoint is used to login.'
    '/login', passport.authenticate('github'), (req, res) => {});

router.get(
    //#swagger.tags=['Authentication']
    //#swagger.summary='Logout Authenticated User'
    //#swagger.description='This endpoint is used to logout.'
    '/logout', function (req, res, next) {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router;
