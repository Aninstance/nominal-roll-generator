const validations = require('../../validators/validations');
const NominalRollModels = require('../../models/nominal-roll-models');
const Response = function (req, res, next) {
  // do validations
  req.check(validations.unitSchema);
  req.getValidationResult().then(function (result) {
    if (result.isEmpty()) {
      NominalRollModels.MilitaryUnits.create(req.body, function (err, created) {
        return !!err ?
          respond(res, {
            data: null,
            success: false,
            error: 'Validation error! Does the unit already exist?',
            errDetail: err.toString() || null
          }) :
          respond(res, {
            data: created,
            success: true,
            error: null,
            errDetail: null
          })
      });
    }
    else { // failed validation
      return respond(res, {
        data: null,
        success: false,
        error: 'Validation error!!',
        errDetail: result ? result.array().map(r => r.msg) : null
      });
    }
  }).catch((err) => respond(res, {
      data: null,
      success: false,
      error: 'Validation error!!!',
      errDetail: err ? err.toString() : null
    }
  ))
};

function respond(res, jsonToReturn) {
  return res.status(jsonToReturn.error === null ? 200 : 422).json(jsonToReturn);
}

module.exports = Response;

