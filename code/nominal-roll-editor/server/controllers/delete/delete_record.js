const validations = require('../../validators/validations');
const NominalRollModels = require('../../models/nominal-roll-models');
const Response = function (req, res, next) {

  // do validations
  req.check(validations.recordSchema);
  req.getValidationResult().then(function (result) {
    if (result.isEmpty()) {
      NominalRollModels.SoldierRecords.findByIdAndRemove(req.params.record_id,
        function (err, removed) {
          return !!err ?
            respond(res, {data: [], success: false, error: 'Error - record not deleted!'}):
            respond(res, {data: [], success: true, error: err})
        });
    }
    else { // failed validation
      return respond(res, {data: null, success: false, error: result.array()[0].msg});
    }
  }).catch((err) => respond(res, {data: null, success: false, error: err}
  ));

  function respond(res, jsonToReturn) {
    return res.status(jsonToReturn.error === null ? 200 : 422).json(jsonToReturn);
  }
};
module.exports = Response;

