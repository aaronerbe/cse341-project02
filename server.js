const express = require('express');
const mongodb = require('./db/database');
const bodyParser = require('body-parser');
//const swaggerUI = require('swagger-ui-express');
//const swaggerDocument = require('./swagger.json');
const createError = require('http-errors');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
//app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(bodyParser.json());
app.use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'], origin: "*" }));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes'));

// Add these 3 objects to .env
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
}, function (accessToken, refreshToken, profile, done) {
    // Normally we want to pass this into the mongodb endpoint when adding a new user
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    return done(null, profile);
    // });
}));

// Passport serialization
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// OAuth endpoints
app.get('/', (req, res) => {
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out");
});

// GitHub callback
app.get('/github/callback', passport.authenticate('github', { failureRedirect: '/api-docs', session: false }),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    }
);

// Initialize database and start server
mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`Database is listening on ${port}`);
        });
    }
});

// Error handler for 404
app.use((req, res, next) => {
    next(createError(404, 'Not Found'));
});

// General error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    });
});
