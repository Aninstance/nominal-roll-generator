"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validations = require("../../validators/validations");
const NominalRollModels = require("../../models/nominal-roll-models");
module.exports = (req, res, next) => {
    // do validations
    req.check(validations.unitSchema);
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            NominalRollModels.MilitaryUnits.findByIdAndUpdate(req.params.unit_id, req.body, { new: true }, function (err, updated) {
                return !!err ?
                    respond(res, { data: [], success: false, error: 'Validation error!' }) :
                    respond(res, { data: updated, success: true, error: err });
            });
        }
        else {
            return respond(res, { data: null, success: false, error: result.array()[0].msg });
        }
    }).catch((err) => respond(res, { data: null, success: false, error: err }));
    function respond(res, jsonToReturn) {
        return res.status(jsonToReturn.error === null ? 200 : 422).json(jsonToReturn);
    }
};
//# sourceMappingURL=put_unit.js.map