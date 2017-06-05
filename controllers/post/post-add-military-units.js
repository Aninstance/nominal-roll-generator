const NominalRollModels = require('../../models/nominal-roll-models');
const validations = require('../../validators/validations');

const Response = function(req, res, next) {
  if (req.body.submit === 'Add Unit(s)') {
    if (req.body.military_units) {
      req.checkBody(validations.unit_name_validation);
      req.sanitize('military_units').military_unit_formatter(); // format units ([[Date, String]])
      req.sanitize('military_units').capitalizeUnitArray(); // capitalize array
      req.getValidationResult().then(function(result) {
        let error = '';
        if (result.isEmpty() && req.body.military_units) { // modifying available units
          req.body.military_units.forEach(function(unit) {
            // ignore unspecified unit titles, as that has to remain single & unique
            if (unit[1] !== 'Unspecified') {
              let unitObject = {
                'unit_name': unit[1],
                'unit_display_name': unit[1],
                'unit_period': unit[0]
              };
              // ADD RECORD
              NominalRollModels.MilitaryUnits.create(unitObject, function(err, unitObject) {
                if (err) {
                  error += err;
                }
              });
            } else {
              error += 'You cannot add another Unspecified unit. Stop being a wally!';
            }
          });
          if (error) {
            return fail(res, error);
          } else {
            return res.status(201).redirect('/nominal-roll');
          }
        } else {
          // return appropriate error (military_units would be false if sanitization failed, or existing but invalid if validation failed)
          let e = !req.body.military_units ? 'A unit formatting error has occurred. Please advise the system administrator.' : null;
          return fail(res, e ? e : `${result.array()[0].msg} ${error}`); // send validation OR sanitization error to fail function for return
        }
      }).catch(next);
    } else {
      return fail(res, 'Nothing was submitted!');
    }
  } else if (req.body.submit === 'Remove Selected Unit(s)') {
    // REMOVE RECORD
    delete req.body.military_units; // do not try to validate this, as this form field is not required, just delete it
    req.checkBody(validations.unit_name_validation);
    req.getValidationResult().then(function(result) {
      let error = '';
      if (result.isEmpty()) { // validated (validation returns no 'result')
        // remove from available units. Removing unit from soldier record handled directly on post--nominal-roll
        req.body.soldier_units.forEach(function(u) {
          // ignore unspecified, as that has to remain for system purposes!
          if (u !== 'Unspecified') {
            NominalRollModels.MilitaryUnits.findByIdAndRemove(u, function(err, removed) {
              error += err;
            });
          } else {
            error += 'You cannot remove the Unspecified unit. Stop being a wally!';
          }
        });
        if (error) {
          return fail(res, error);
        } else {
          return res.status(201).redirect('/nominal-roll');
        }
      } else {
        return fail(res, `${result.array()[0].msg} ${error}`);
      }
    }).catch(next);
  } else {
    return fail(res, 'Nothing was submitted!');
  }
};

function fail(res, error) {
  // return the original, unpopulated form
  let opts;
  // populate the military units selection
  NominalRollModels.MilitaryUnits.find({}, null, {
    sort: {
      unit_period: -1,
      unit_name: -1
    }
  }, function(err, results) {
    if (err) {
      error = 'No records returned!';
    } else {
      opts += `<option value="Unspecified">---- | Unspecified</option>`;
      results.forEach(function(unit) {
        let year = unit.unit_period instanceof Date ? unit.unit_period.getFullYear() : '----';
        opts += `<option value="${unit._id}">${year} | ${unit.unit_display_name}</option>`;
      });
    }
    return res.status(422).render('military-unit-form', {
      error: error,
      unitOptions: opts,
    });
  });
}
module.exports = Response;
