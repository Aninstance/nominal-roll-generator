const router = require('express').Router();
const bodyParser = require('body-parser');

// GET

router.get('/', bodyParser.urlencoded({extended: true}), function (req, res, next) {
    res.redirect('/nominal-roll/?docs=true');
});

router.get('/nominal-roll/:record_id?', bodyParser.urlencoded({extended: true}), function (req, res, next) {
    const Response = require('../controllers/get/get-nominal-roll');
    Response(req, res, next);
});

router.get('/add-military-units', bodyParser.urlencoded({extended: true}), function (req, res, next) {
    const Response = require('../controllers/get/get-add-military-units');
    Response(req, res, next);
});

// POST

router.post('/nominal-roll/:record_id?', bodyParser.urlencoded({extended: true}), function (req, res, next) {
    const Response = require('../controllers/post/post-nominal-roll');
    Response(req, res, next);
});

router.post('/add-military-units', bodyParser.urlencoded({extended: true}), function (req, res, next) {
    const Response = require('../controllers/post/post-add-military-units');
    Response(req, res, next);
});

// DELETE

router.delete('/nominal-roll/:param', bodyParser.urlencoded({extended: true}), function (req, res, next) {
    const Response = require('../controllers/delete/delete-nominal-roll');
    Response(req, res, next);
});

//PUT

router.put('/nominal-roll/:param', bodyParser.urlencoded({extended: true}), function (req, res, next) {
    const Response = require('../controllers/put/put-nominal-roll');
    Response(req, res, next);
});

module.exports = router;
