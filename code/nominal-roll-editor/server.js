const express = require('express'),
  app = express(),
  api = require('./server/routes/web-routes'),
  expressValidator = require('express-validator'),
  validatorDefinitions = require('./server/validators/validator-definitions'),
  bodyParser = require('body-parser'),
  path = require('path'),
  http = require('http'),
  cors = require('cors'), // for cross-origin resource sharing
  authenticate = require('./server/custom_middleware/authentication'),
  authorise = require('./server/routes/authorisation');

// static path
app.use(express.static(path.join(__dirname, 'static')));

// allow cross-origin sharing of resource
app.use(cors());

// body parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// content filter - must be immediately after any of the bodyParser middleware!
app.use(expressValidator(validatorDefinitions));

// AUTHENTICATION (middleware)
app.use(authenticate);

// AUTHORISATION (middleware)
app.use(authorise); // run all route requests through authorization testing

// ERROR HANDLING (middleware)
app.use((err, req, res, next) => {
  console.log(`EXPRESS ERROR HAS OCCURRED: ${err}`);
  return res.status(500).json([{
    error: `${err}`
  }]);
});

// path to api
app.use('/api', api);

// Catch all other non-api routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/server/static/index.html'));
});

/* SERVER */

// Get port from environment and store in Express.
const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// listen to port
server.listen(port, () => console.log(`API running on localhost:${port}`));
