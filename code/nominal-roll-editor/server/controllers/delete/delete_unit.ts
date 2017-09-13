module.exports = (req, res, next) => {
  // do validations
  req.check(validations.unitSchema);
  req.getValidationResult().then(function (result) {
    if (result.isEmpty()) {
      NominalRollModels.MilitaryUnits.findByIdAndRemove(req.params.unit_id,
        function (err, removed) {
          if (err) {
            return respond(res, {
              data: [],
              success: false,
              error: 'Error - record not deleted!'
            })
          } else {
            if (!removed) {
              return respond(res, {
                data: [],
                success: false,
                error: 'Record not found!'
              })
            } else {
              respond(res, {
                data: removed,
                success: true,
                error: err
              })
            }
          }
        });
    } else { // failed validation
      return respond(res, {
        data: null,
        success: false,
        error: result.array()[0].msg
      });
    }
  }).catch((err) => respond(res, {
    data: null,
    success: false,
    error: err
  }));

  function respond(res, jsonToReturn) {
    return res.status(jsonToReturn.error === null ? 200 : 422).json(jsonToReturn);
  }
};

