const NominalRollModels = require('../../models/nominal-roll-models');
const validations = require('../../validators/validations');
const Response = function(req, res, next) {
  req.checkParams(validations.recordIDValidation);
  req.getValidationResult().then(function(result) {
    let recordError = '';
    let edit = false;
    let record = {
      _id: '',
      soldier_surname: '',
      soldier_firstname: '',
      soldier_units: [],
      kia: []
    };
    if (result.isEmpty()) { // param was validated (nothing or a valid value)
      edit = !!req.params.record_id; // edit mode true if record_id param existed
      // edit mode
      if (edit) {
        // edit mode
        NominalRollModels.SoldierRecords.findById(req.params.record_id, function(err, results) {
          if (err || results === null) {
            recordError += ' Error: No soldier record returned! ';
          } else {
            record = results;
          }
          respond(res, recordError, record);
        });
      } else {
        // create mode
        respond(res, recordError, record);
      }
    } else {
      // param was not a valid record ID
      recordError += result.array()[0].msg;
      respond(res, recordError, record);
    }
  }).catch(next);
};

function respond(res, error, record) {
  let opts;
  NominalRollModels.MilitaryUnits.find({}, null, {
    sort: {
      unit_period: -1,
      unit_name: 1
    }
  }, function(err, results) {
    if (err) {
      error += ' Error: No unit records returned! ';
    } else {
      let selected = '';
      opts += `<option value="Unspecified">---- | Unspecified</option>`;
      results.forEach(function(unit) {
        let year = unit.unit_period instanceof Date ? unit.unit_period.getFullYear() : '----';
        selected = record.soldier_units.indexOf(`${year} | ${unit.unit_name}`) !== -1 ? 'selected' : '';
        opts += `<option value="${year} | ${unit.unit_name}" ${selected}>${year} | ${unit.unit_display_name}</option>`;
      });
    }
    let returnStatus = error === '' ? 200 : 422;
    return res.status(returnStatus).render(
      'roll-editor', {
        unitOptions: opts,
        recordError: error,
        record: record
      });
  });
}

module.exports = Response;
