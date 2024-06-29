const express = require('express');
const mongodb = require('./db/database');
const bodyParser = require('body-parser');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const createError = require('http-errors');
const app = express();
const port = process.env.PORT || 8080;

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(bodyParser.json());
app.use('/', require('./routes'));

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`Database is listening on ${port}`);
        });
    }
});

//ERROR HANDLER
app.use((req, res, next) => {
    next(createError(404, 'Not Found'));
});
//ERROR HANDLER
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    });
});
