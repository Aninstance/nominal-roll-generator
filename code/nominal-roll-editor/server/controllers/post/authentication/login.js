const NominalRollModels = require('../../../models/nominal-roll-models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validations = require('../../../validators/validations');

// for docs & api for node-jsonwebtoken, see: https://github.com/auth0/node-jsonwebtoken

const Response = (req, res, next) => {
  // do validations
  req.check(validations.userSchema);
  req.getValidationResult().then((result) => {
    if (result.isEmpty() && fieldsExist([req.body.password, req.body.email])) {
      User.findOneAndUpdate({
          email: req.body.email
        }, {
          $inc: {
            'tokenCounter': 1
          }
        }, {
          new: true
        },
        (err, user) => {
          if (err) {
            return respond(res, {
              data: null,
              success: false,
              error: 'Authentication system error.',
              errDetail: err ? err.toString() : null
            });
          };
          if (!user) {
            return respond(res, {
              data: null,
              success: false,
              error: 'User not found.',
              errDetail: err ? err.toString() : null
            });
          } else if (user) {
            if (!user.comparePassword(req.body.password)) {
              return respond(res, {
                data: null,
                success: false,
                error: 'Authentication failed!',
                errDetail: err ? err.toString() : null
              });
            } else {
              return respond(res, {
                data: {
                  token: jwt.sign({
                    _id: user._id,
                    role: user.role,
                    tokenIssueNumber: user.tokenCounter.toString()
                  }, 'XK0wUVhaZyvUlwkWy1w5y91POzA1WlYbxx2me', {
                    expiresIn: (60 * 60) * 24, // expire in 24 hours
                  }),
                  role: user.role // return role in plaintext for use in client
                },
                success: true,
                error: null,
                errDetail: err ? err.toString() : null
              });
            }
          }
        })
    } else {
      // failed POST validation
      return respond(res, {
        data: null,
        success: false,
        error: 'A validation error occurred!',
        errDetail: result ? result.array().map(r => r.msg) : null
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
