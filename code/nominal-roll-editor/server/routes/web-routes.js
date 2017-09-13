"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("express");
const bodyParser = require("body-parser");
const router = Router.Router();
// GET
router.get('/', bodyParser.urlencoded({
    extended: true
}), function (req, res, next) {
    res.redirect('/api/nominal-roll/record');
});
router.get('/nominal-roll/record/:record_id?', bodyParser.urlencoded({
    extended: true
}), function (req, res, next) {
    const Response = require('../controllers/get/get_records');
    Response(req, res, next);
});
router.get('/nominal-roll/units/:unit_id?', bodyParser.urlencoded({
    extended: true
}), function (req, res, next) {
    const Response = require('../controllers/get/get_units');
    Response(req, res, next);
});
router.get('/administration', bodyParser.urlencoded({
    extended: true
}), function (req, res, next) {
    const Response = require('../controllers/get/get_administration');
    Response(req, res, next);
});
// // POST
router.post('/nominal-roll/units', bodyParser.urlencoded({
    extended: true
}), function (req, res, next) {
    const Response = require('../controllers/post/post_units');
    Response(req, res, next);
});
router.post('/nominal-roll/record', bodyParser.urlencoded({
    extended: true
}), function (req, res, next) {
    const Response = require('../controllers/post/post_record');
    Response(req, res, next);
});
router.post('/nominal-roll/roll', bodyParser.urlencoded({
    extended: true
}), function (req, res, next) {
    const Response = require('../controllers/post/post_roll');
    Response(req, res, next);
});
router.post('/register', bodyParser.urlencoded({
    extended: true
}), function (req, res, next) {
    const Response = require('../controllers/post/authentication/register');
    Response(req, res, next);
});
router.post('/login', bodyParser.urlencoded({
    extended: true
}), function (req, res, next) {
    const Response = require('../controllers/post/authentication/login');
    Response(req, res, next);
});
router.post('/administration', bodyParser.urlencoded({
    extended: true
}), function (req, res, next) {
    const Response = require('../controllers/post/post_administration');
    Response(req, res, next);
});
// // PUT
router.put('/nominal-roll/units/:unit_id', bodyParser.urlencoded({
    extended: true
}), function (req, res, next) {
    const Response = require('../controllers/put/put_unit');
    Response(req, res, next);
});
router.put('/nominal-roll/record/:record_id', bodyParser.urlencoded({
    extended: true
}), function (req, res, next) {
    const Response = require('../controllers/put/put_record');
    Response(req, res, next);
});
router.put('/administration', bodyParser.urlencoded({
    extended: true
}), function (req, res, next) {
    const Response = require('../controllers/put/put_administration');
    Response(req, res, next);
});
// // DELETE
router.delete('/nominal-roll/units/:unit_id', bodyParser.urlencoded({
    extended: true
}), function (req, res, next) {
    const Response = require('../controllers/delete/delete_unit');
    Response(req, res, next);
});
router.delete('/nominal-roll/record/:record_id', bodyParser.urlencoded({
    extended: true
}), function (req, res, next) {
    const Response = require('../controllers/delete/delete_record');
    Response(req, res, next);
});
router.delete('/administration', bodyParser.urlencoded({
    extended: true
}), function (req, res, next) {
    const Response = require('../controllers/delete/delete_administration');
    Response(req, res, next);
});
module.exports = router;
//# sourceMappingURL=web-routes.js.map