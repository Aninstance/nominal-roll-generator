const express = require('express'),
    app = express(),
    webRoutes = require('./routes/web-routes'),
    mongoose = require('mongoose'),
    expressValidator = require('express-validator'),
    validatorDefinitions = require('./validators/validator-definitions');


// connect to mongodb
mongoose.connect('mongodb://sasoriginals:9SP*0sx@mongo:27017/db-nominal-roll');
mongoose.Promise = global.Promise;


// // MIDDLEWARE // //
// note: ORDER of middleware MATTERS. Chained, with 'next' invoking the next!

// template engine
app.set('view engine', 'ejs');
app.use(express.static('./public'));

// content filter - must be immediately after any of the bodyParser middleware!
app.use(expressValidator(validatorDefinitions));

// routes
app.use('/', webRoutes); // '/' is path, resources defined in webRoutes.js

// error handling middleware
// note: as well as adding middleware from package (as routes, etc), can create own - e.g. here, for error handling. All middleware needs to handle requests (req), response (res) and next middleware - in case there is any to add to the chain, (next)
app.use(function (err, req, res, next) {
    console.log(`An error has occurred: ${err}`);
    return res.status(500).render('500', {
        error: 'A server error has occurred. Please report this to a system administrator.'});
});


// // END OF MIDDLEWARE // //

// fire controllers
//controller(app);

// listen to port
app.listen(process.env.port || 3000, function () {
    console.log('Listening on 3000');
});
