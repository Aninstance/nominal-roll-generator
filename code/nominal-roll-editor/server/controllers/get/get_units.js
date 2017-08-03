const NominalRollModels = require('../../models/nominal-roll-models');
const validations = require('../../validators/validations');

const Response = function (req, res, next) {
  req.check(validations.unitSchema);
  req.getValidationResult().then(function (result) {
    if (result.isEmpty()) { // param was validated (nothing or a valid value)
      if (req.params.unit_id !== undefined) {  // param exists - querying for ID
        NominalRollModels.MilitaryUnits.findById(req.params.unit_id, null, {
          sort: {
            unit_period: -1,
            unit_name: 1
          }
        }, function (err, record) {
          return createResponse(res, err, record);
        });
      }
      else if (req.query.unit_name !== undefined) {  // param exists - querying for unit
        req.sanitizeQuery('unit_name').underscoreToSpace();
        NominalRollModels.MilitaryUnits.find(
          {
            'unit_name': {
              '$regex': req.query.unit_name, '$options': 'i'
            }
          },
          null, {
            sort: {
              unit_period: -1,
              unit_name: 1
            }
          }, function (err, record) {
            return createResponse(res, err, record);
          }
        );
      }
      else if (req.params.unit_id === undefined) {  // no param, return all units
        NominalRollModels.MilitaryUnits.find({}, null, {
          sort: {
            unit_period: -1,
            unit_name: 1
          }
        }, function (err, record) {
          return createResponse(res, err, record);
        });
      }
    }
    else {
      return respond(res, {
        data: null,
        success: false,
        error: result.array()[0].msg
      })
    }
  }).catch((err) => respond(res, {
    data: null,
    success: false,
    error: err
  }));
};

function createResponse(res, err, record) {
  let jsonToReturn = {
    data: record,
    success: !err,
    error: err || null
  };
  return respond(res, jsonToReturn);
}

function respond(res, jsonToReturn) {
  return res.status(jsonToReturn.error === null ? 200 : 422).json(jsonToReturn);
}
module.exports = Response;
