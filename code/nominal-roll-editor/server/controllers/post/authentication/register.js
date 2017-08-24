const NominalRollModels = require('../../../models/nominal-roll-models');
const bcrypt = require('bcrypt');
const validations = require('../../../validators/validations');

const Response = (req, res, next) => {
  // do validations
  req.check(validations.userSchema);
  req.getValidationResult().then((result) => {
    if (result.isEmpty() && fieldsExist([req.body.password, req.body.fullName, req.body.email])) {
      const newUser = new User(req.body);
      newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
      newUser.save((err, user) => {
        if (err) {
          console.log(err ? err.toString() : null);
          return respond(res, {
            data: null,
            success: false,
            error: 'Registration error!',
            errDetail: 'Registration failed! Have you already registered this email address? Please check the details of your submission and try again!'
          });
        } else {
          user.hash_password = undefined;
          return respond(res, {
            data: {_id: newUser._id},
            success: true,
            error: null,
            errDetail: err ? err.toString() : null
          });
        }
      });
    } else {
      // failed POST validation
      console.log(result ? result.array().map(r => r.msg) : null)
      return respond(res, {
        data: null,
        success: false,
        error: 'A validation error!',
        errDetail: `${result ? result.array().map(r => r.msg) : null}`
      });
    }
  })
};

function respond(res, jsonToReturn) {
  return res.status(jsonToReturn.error === null ? 200 : 422).json(jsonToReturn);
};

function fieldsExist(fields) {
  return Array.isArray(fields) && fields.filter(f => f).length === fields.length;
}

module.exports = Response;
