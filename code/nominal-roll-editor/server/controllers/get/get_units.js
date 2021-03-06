"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validations = require("../../validators/validations");
const NominalRollModels = require("../../models/nominal-roll-models");
const batchSize = 25; //  max to return
module.exports = (req, res, next) => {
    req.check(validations.unitSchema);
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            // variables to allow fetching of results starting from a pointer location
            let requestedBatch = req.query.batch && req.query.batch !== undefined ? +req.query.batch : 0;
            let skipResults = requestedBatch ? (requestedBatch * batchSize) - batchSize : 0;
            if (req.params.unit_id !== undefined) {
                NominalRollModels.MilitaryUnits.findById(req.params.unit_id, null, {
                    sort: {
                        unit_name: 1
                    }
                }, function (err, record) {
                    return createResponse(res, err, record, err ? 0 : 1, requestedBatch);
                });
            }
            else if (req.query.unit_name !== undefined) {
                req.sanitizeQuery('unit_name').underscoreToSpace();
                // count
                NominalRollModels.MilitaryUnits.count({
                    'unit_name': {
                        '$regex': req.query.unit_name, '$options': 'i'
                    }
                }, (err, result) => {
                    return err ? createResponse(res, err, null, 0, requestedBatch) : runSearchQuery(result);
                });
                // full query
                function runSearchQuery(recordCount) {
                    NominalRollModels.MilitaryUnits.find({
                        'unit_name': {
                            '$regex': req.query.unit_name, '$options': 'i'
                        }
                    }, null, {
                        sort: {
                            unit_name: 1
                        },
                        skip: skipResults,
                        limit: batchSize,
                    }, function (err, record) {
                        return createResponse(res, err, record, recordCount, requestedBatch);
                    });
                }
            }
            else if (req.params.unit_id === undefined) {
                // count
                NominalRollModels.MilitaryUnits.count({}, (err, result) => {
                    return err ? createResponse(res, err, null, 0, requestedBatch) : runGetAllQuery(result);
                });
                // query
                function runGetAllQuery(recordCount) {
                    NominalRollModels.MilitaryUnits.find({}, null, {
                        sort: {
                            unit_name: 1
                        },
                        skip: skipResults,
                        limit: batchSize,
                    }, function (err, record) {
                        return createResponse(res, err, record, recordCount, requestedBatch);
                    });
                }
            }
        }
        else {
            return respond(res, {
                success: false,
                error: result.array()[0].msg,
                batch: +req.query.batch ? +req.query.batch : 0,
                count: 0,
                data: null,
            });
        }
    }).catch((err) => respond(res, {
        success: false,
        error: err,
        batch: +req.query.batch ? +req.query.batch : 0,
        count: 0,
        data: null,
    }));
    function createResponse(res, err, records, recordCount, requestedBatch) {
        let jsonToReturn = {
            success: !err,
            error: err || null,
            batch: requestedBatch,
            batchSize: batchSize,
            count: +recordCount,
            data: records ? formatData(records) : [],
        };
        return respond(res, jsonToReturn);
    }
    function formatData(data) {
        // return formatted data
        return Array.isArray(data) ? data.map((record) => doFormatting(record)) : doFormatting(data);
        function doFormatting(data) {
            // no additional formatting necessary yet (leave function for future additions)
            return data;
        }
    }
    function respond(res, jsonToReturn) {
        return res.status(jsonToReturn.error === null ? 200 : 422).json(jsonToReturn);
    }
};
//# sourceMappingURL=get_units.js.map