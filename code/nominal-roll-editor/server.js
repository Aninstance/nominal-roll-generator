const express = require('express'),
  app = express(),
  api = require('./server/routes/web-routes'),
  expressValidator = require('express-validator'),
  validatorDefinitions = require('./server/validators/validator-definitions'),
  bodyParser = require('body-parser'),
  path = require('path'),
  http = require('http'),
  cors = require('cors');  // for cross-origin resource sharing

// // MIDDLEWARE // //

// point static path to dist to serve angular frontend
app.use(express.static(path.join(__dirname, 'static')));
app.use(cors());  // allow cross-origin sharing of resource

/*
 Set our API routes - FURTHER ROUTING AND RESPONSES FROM HERE WILL BE HANDLED BY SERVER-SIDE NODEJS
 */

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// content filter - must be immediately after any of the bodyParser middleware!
app.use(expressValidator(validatorDefinitions));

// error handling middleware
// note: as well as adding middleware from package (as routes, etc), can create own - e.g. here, for error handling. All middleware needs to handle requests (req), response (res) and next middleware - in case there is any to add to the chain, (next)
app.use(function (err, req, res, next) {
  console.log(`An error has occurred: ${err}`);
  return res.status(500).json([{
    error: `${err}`
  }]);
});

app.use('/api', api); // '/' is path, resources defined in web-routes.js


/*
 Catch all other routes and return the index file - FURTHER ROUTING AND RESPONSES FROM HERE WILL BE HANDLED BY CLIENT-SIDE ANGULAR
 */

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/index.html'));
// });

// // END OF MIDDLEWARE // //

// Get port from environment and store in Express.
const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// listen to port
server.listen(port, () => console.log(`API running on localhost:${port}`));
