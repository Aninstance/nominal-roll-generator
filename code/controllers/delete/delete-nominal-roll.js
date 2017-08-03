const NominalRollModels = require('../../models/nominal-roll-models');
const validations = require('../../validators/validations');

const Response = function (req, res, next) {
    req.check(validations.deleteValidation);
    req.getValidationResult().then(function (result) {
        var q = null;
        if (result.isEmpty()) {
            // delete item from mongo
            NominalRollModels.SoldierRecords.findByIdAndRemove({_id: req.params.param}).then(function (item) {
                res.send(item);
            }).catch(() =>
                res.status(422).json({
                    error: {
                        msg: 'This record ID could not be deleted! Are you sure the record exists?'
                    }
                }));
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