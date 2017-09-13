import validations = require('../../validators/validations');
import NominalRollModels = require('../../models/nominal-roll-models');

module.exports = (req, res, next) => {
  req.check(validations.administrationSchema);
  req.getValidationResult().then(function (result) {
    if (result.isEmpty()) {
      createResponse(res, null, 'dummy')
    } else {
      createResponse(
        res,
        result.array()[0].msg,
        null)
    }
  });

  function createResponse(res, err, data) {
    let jsonToReturn = {
      success: !err,
      error: err || null,
      data: data ? formatData(data) : [],
    };
    return respond(res, jsonToReturn);
  }

  function formatData(data) {
    // return formatted data
    return Array.isArray(data) ? data.map((d) => doFormatting(d)) : doFormatting(data);

    function doFormatting(data) {
      // no additional formatting necessary yet (leave function for future additions)
      return data;
    }
  }

  function respond(res, jsonToReturn) {
    return res.status(jsonToReturn.error === null ? 200 : 422).json(jsonToReturn);
  }
}