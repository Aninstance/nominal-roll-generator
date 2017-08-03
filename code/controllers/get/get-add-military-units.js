const NominalRollModels = require('../../models/nominal-roll-models');
const Response = function (req, res, next) {
    let error;
    let opts;
    // populate the military units selection
    NominalRollModels.MilitaryUnits.find({}, null, {sort: {
        unit_period: -1, unit_name: -1
    }}, function (err, results) {
        if (err) {
            error = 'No records returned!';
        } else {
           opts += `<option value="Unspecified">---- | Unspecified</option>`;
            results.forEach(function (unit) {
                let year = unit.unit_period instanceof Date ? unit.unit_period.getFullYear() : '----';
                opts += `<option value="${unit._id}">${year} | ${unit.unit_display_name}</option>`;
            });
        }
        res.render('military-unit-form', {
            error: error, unitOptions: opts,
        });
    });
};
module.exports = Response;
