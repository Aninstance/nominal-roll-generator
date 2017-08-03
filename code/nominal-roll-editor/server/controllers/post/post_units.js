const validations = require('../../validators/validations');
const NominalRollModels = require('../../models/nominal-roll-models');
const Response = function (req, res, next) {
  let err = null;
  // do validations
  req.check(validations.unitSchema);
  req.getValidationResult().then(function (result) {
    if (result.isEmpty()) {
      NominalRollModels.MilitaryUnits.create(req.body, function (err, created) {
        return !!err ?
          respond(res, {
            data: null, success: false,
            error: 'Validation error! Does the unit already exist?',
            errDetail: err
          }) :
          respond(res, {data: created, success: true, error: err})
      });
    }
    else { // failed validation
      return respond(res, {data: null, success: false, error: result.array()[0].msg});
    }
  }).catch((err) => respond(res, {data: null, success: false, error: err}
  ))
};

function respond(res, jsonToReturn) {
  return res.status(jsonToReturn.error === null ? 200 : 422).json(jsonToReturn);
}

module.exports = Response;

