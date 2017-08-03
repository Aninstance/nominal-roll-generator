const NominalRollModels = require('../../models/nominal-roll-models');
const validations = require('../../validators/validations');
const Response = function (req, res, next) {

    req.check(validations.updateUnit);
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            NominalRollModels.SoldierRecords.findById(req.params.param).then(function (item) {
                var index = 0;
                // find unit in units array and delete it
                item.soldier_units.forEach(function (unit) {
                    if (unit === req.query.unit) {
                        item.soldier_units.splice(index, 1);
                    }
                    index++;
                });
                // ensure unit has 'unspecified' if now empty
                if (!item.soldier_units.length) {
                    item.soldier_units.splice(0, 0, 'Unspecified');
                }
                // save amended record
                item.save().then(function () {
                    res.status(200).json({success: true});  // return posted data as response if successfully added to db
                }).catch((error) =>
                    res.status(422).json({
                            error: {
                                msg: `An error has occurred and the record could not be updated: ${error}`
                            }
                        }
                    ));
            }).catch(() =>
                res.status(422).json({
                        error: {
                            msg: 'This record ID could not be updated! Are you sure the record exists?'
                        }
                    }
                ));
        }
        else {
            // did not validate (non validation returns a 'result')
            res.status(422).json({
                error: {
                    param: result.array()[0].param,  // return only first error in array
                    msg: result.array()[0].msg
                }
            });
        }
    })
};
module.exports = Response;
