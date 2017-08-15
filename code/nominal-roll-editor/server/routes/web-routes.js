const router = require('express').Router();
const bodyParser = require('body-parser');

// GET

router.get('/', bodyParser.urlencoded({extended: true}), function (req, res, next) {
  res.redirect('/api/nominal-roll/record');
});

router.get('/nominal-roll/record/:record_id?', bodyParser.urlencoded({extended: true}), function (req, res, next) {
  const Response = require('../controllers/get/get_records');
  Response(req, res, next);
});

router.get('/nominal-roll/units/:unit_id?', bodyParser.urlencoded({extended: true}), function (req, res, next) {
  const Response = require('../controllers/get/get_units');
  Response(req, res, next);
});


// // POST

router.post('/nominal-roll/units', bodyParser.urlencoded({extended: true}), function (req, res, next) {
  const Response = require('../controllers/post/post_units');
  Response(req, res, next);
});

router.post('/nominal-roll/record', bodyParser.urlencoded({extended: true}), function (req, res, next) {
  const Response = require('../controllers/post/post_record');
  Response(req, res, next);
});

router.post('/nominal-roll/roll', bodyParser.urlencoded({extended: true}), function (req, res, next) {
  const Response = require('../controllers/post/post_roll');
  Response(req, res, next);
});

// // PUT

router.put('/nominal-roll/units/:unit_id', bodyParser.urlencoded({extended: true}), function (req, res, next) {
  const Response = require('../controllers/put/put_unit');
  Response(req, res, next);
});

router.put('/nominal-roll/record/:record_id', bodyParser.urlencoded({extended: true}), function (req, res, next) {
  const Response = require('../controllers/put/put_record');
  Response(req, res, next);
});

// // DELETE

router.delete('/nominal-roll/units/:unit_id', bodyParser.urlencoded({extended: true}), function (req, res, next) {
  const Response = require('../controllers/delete/delete_unit');
  Response(req, res, next);
});

router.delete('/nominal-roll/record/:record_id', bodyParser.urlencoded({extended: true}), function (req, res, next) {
  const Response = require('../controllers/delete/delete_record');
  Response(req, res, next);
});

module.exports = router;
