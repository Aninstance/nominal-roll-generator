"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validations = require("../../validators/validations");
const NominalRollModels = require("../../models/nominal-roll-models");
const batchSize = 25; //  max to return
module.exports = (req, res, next) => {
    req.check(validations.recordSchema);
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            // variables to allow fetching of results starting from a pointer location
            let requestedBatch = req.query.batch && req.query.batch !== undefined ? +req.query.batch : 0;
            let skipResults = requestedBatch ? (requestedBatch * batchSize) - batchSize : 0;
            // run queries
            if (req.params.record_id !== undefined) {
                NominalRollModels.SoldierRecords.findById(req.params.record_id, null, {}, function (err, record) {
                    return createResponse(res, err, record, err ? 0 : 1, requestedBatch);
                });
            }
            else if (req.query.unit_name !== undefined) {
                req.sanitizeQuery('unit_name').underscoreToSpace();
                // count
                NominalRollModels.SoldierRecords.count({
                    'soldier_units': {
                        '$elemMatch': {
                            'unit.unit_name': {
                                '$regex': req.query.unit_name, '$options': 'i'
                            }
                        }
                    }
                }, (err, result) => {
                    return err ? createResponse(res, err, null, 0, requestedBatch) : runUnitSearchQuery(result);
                });
                function runUnitSearchQuery(recordCount) {
                    NominalRollModels.SoldierRecords.find({
                        'soldier_units': {
                            '$elemMatch': {
                                'unit.unit_name': {
                                    '$regex': req.query.unit_name, '$options': 'i'
                                }
                            }
                        }
                    }, null, {
                        sort: {
                            soldier_surname: 1
                        },
                        skip: skipResults,
                        limit: batchSize,
                    }, function (err, record) {
                        return createResponse(res, err, record, recordCount, requestedBatch);
                    });
                }
            }
            else if (req.query.soldier_surname !== undefined) {
                // count
                NominalRollModels.SoldierRecords.count({
                    'soldier_surname': {
                        '$regex': req.query.soldier_surname, '$options': 'i'
                    }
                }, (err, result) => {
                    return err ? createResponse(res, err, null, 0, requestedBatch) : runSurnameSearchQuery(result);
                });
                function runSurnameSearchQuery(recordCount) {
                    NominalRollModels.SoldierRecords.find({
                        'soldier_surname': {
                            '$regex': req.query.soldier_surname, '$options': 'i'
                        }
                    }, null, {
                        sort: {
                            soldier_surname: 1
                        },
                        skip: skipResults,
                        limit: batchSize,
                    }, function (err, record) {
                        return createResponse(res, err, record, recordCount, requestedBatch);
                    });
                }
            }
            else {
                // count
                NominalRollModels.SoldierRecords.count({}, (err, result) => {
                    return err ? createResponse(res, err, null, 0, requestedBatch) : runGetAllRecordsQuery(result);
                });
                function runGetAllRecordsQuery(recordCount) {
                    NominalRollModels.SoldierRecords.find({}, null, {
                        sort: {
                            soldier_surname: 1
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
            // format to sort units in order of period
            return sortUnits(data);
            // remove time from returned dates
            // removeTime(data)
        }
        function sortUnits(data) {
            // function to sort units in order of period (period from)
            if (data.soldier_units.length > 1) {
                data.soldier_units.sort((a, b) => a.unit_period[0] - b.unit_period[0]);
            }
            return data;
        }
        function removeTime(data) {
            // function to remove time
            if (data.soldier_units.length > 0) {
                data.soldier_units.forEach(function (iter, index, fullArray) {
                    iter.unit_period.forEach(function (iter, index, fullArray) {
                        // format each date in the array
                        fullArray[index] =
                            `${moment(fullArray[index]).format('YYYY-MM-DD')}`;
                    });
                });
            }
        }
    }
    function respond(res, jsonToReturn) {
        return res.status(jsonToReturn.error === null ? 200 : 422).json(jsonToReturn);
    }
};
//# sourceMappingURL=get_records.js.map