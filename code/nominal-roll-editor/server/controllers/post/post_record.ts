import validations = require('../../validators/validations');
import NominalRollModels = require('../../models/nominal-roll-models');

module.exports = (req, res, next) => {
  // do validations
  req.check(validations.recordSchema);
  req.getValidationResult().then(function (result) {
    if (result.isEmpty()) {
      // turn json dates into Date objects
      req.sanitizeBody('soldier_units').soldierUnitsStingsToDates();
      // other sanitizations
      req.sanitizeBody('kia').upperCase();
      req.sanitizeBody('soldier_middlenames').capitalize();
      req.sanitizeBody('soldier_firstname').capitalize();
      req.sanitizeBody('soldier_surname').capitalize();
      NominalRollModels.SoldierRecords.create(req.body, function (err, created) {
        // remove kiaDate value if it was submitted in error when kia 'NO' or 'UNSPECIFIED'
        if (created && created.kia !== 'YES' && created.kiaDate) {
          created.kiaDate = undefined;
          created.save((e, c) => {
            err = e;
            created = c;
            return true;
          });
        }
        return !!err ?
          respond(res, {
            data: null,
            success: false,
            error: 'Validation error!',
            errDetail: err.toString() || null
          }) :
          respond(res, {
            data: created,
            success: true,
            error: null,
            errDetail: null
          })
      });
    } else { // failed validation
      return respond(res, {
        data: null,
        success: false,
        error: 'A validation error!!',
        errDetail: result ? result.array().map(r => r.msg) : null
      });
    }
  }).catch((err) => {
    console.log(err);
    respond(res, {
      data: null,
      success: false,
      error: 'Validation error!!!',
      errDetail: err ? err.toString() : null
    });
  });
  function respond(res, jsonToReturn) {
    return res.status(jsonToReturn.error === null ? 200 : 422).json(jsonToReturn);
  }
};