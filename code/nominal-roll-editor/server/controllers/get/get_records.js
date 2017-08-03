const NominalRollModels = require('../../models/nominal-roll-models');
const validations = require('../../validators/validations');
const moment = require('moment');

const Response = function (req, res, next) {
    req.check(validations.recordSchema);
    req.getValidationResult().then(function (result) {
      if (result.isEmpty()) { // param was validated (nothing or a valid value)
        if (req.params.record_id !== undefined) {  // param exists - querying for ID
          NominalRollModels.SoldierRecords.findById(req.params.record_id, null, {
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
          NominalRollModels.SoldierRecords.find(
            {
              "soldier_units": {
                "$elemMatch": {
                  "unit.unit_name": {
                    "$regex": req.query.unit_name, "$options": "i"
                  }
                }
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
        else if (req.query.soldier_surname !== undefined) {  // param exists - querying for surname
          NominalRollModels.SoldierRecords.find(
            {
              'soldier_surname': {
                '$regex': req.query.soldier_surname, '$options': 'i'
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
        else if (req.params.record_id === undefined) {  // no param
          NominalRollModels.SoldierRecords.find({}, null, {
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
  }
;

function createResponse(res, err, record) {
  let jsonToReturn = {
    data: record ? formatData(record) : [],
    success: !err,
    error: err || null
  };
  return respond(res, jsonToReturn);
}

function formatData(data) {
  // format dates to remove time
  if (data.soldier_units) {
    data.soldier_units.forEach(function (iter, index, fullArray) {
      iter.unit_period.forEach(function (iter, index, fullArray) {
        // format each date in the array
        fullArray[index] =
          `${moment(fullArray[index]).format('YYYY-MM-DD')}`;
      });
    })
  }
  return data;
}

function respond(res, jsonToReturn) {
  return res.status(jsonToReturn.error === null ? 200 : 422).json(jsonToReturn);
}

module.exports = Response;
