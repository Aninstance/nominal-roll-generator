const NominalRollModels = require('../models/nominal-roll-models');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const validations = require('../validators/validations');
const jsonwebtoken = require('jsonwebtoken');

// for docs & api for node-jsonwebtoken, see: https://github.com/auth0/node-jsonwebtoken

module.exports = (req, res, next) => {
  req.check(validations.userSchema);
  req.getValidationResult().then((result) => {
    if (result.isEmpty()) {
      try {
        let tokenType = null;
        let token = null;
        if (req.headers && req.headers.authorization) {
          tokenType = req.headers.authorization.split(' ')[0];
          token = req.headers.authorization.split(' ')[1];
        }
        if (token && tokenType === 'JWT') {
          jsonwebtoken.verify(token, 'XK0wUVhaZyvUlwkWy1w5y91POzA1WlYbxx2me', {
            maxAge: "48h"
          }, (err, decoded) => {
            if (!err && decoded) {
              // check token not revoked (optional - db, revokation index)
              NominalRollModels.User.find({
                '_id': ObjectId(decoded._id),
                'revokedTokens': token
              }).then(
                (data) => {
                  if (!data || data.length < 1) {
                    // OK - authenticated! Add User as property of req for later ref in authorization testing
                    req.user = decoded;
                    return next();
                  } else {
                    return fail(req, res, next, err);
                  }
                }
              ).catch(err => {
                return fail(req, res, next, err);
              })
            }
          });
        } else {
          return fail(req, res, next);
        }
      } catch (err) {
        return fail(req, res, next, err);
      }
    }
  }).catch((err) => fail(req, res, next, err));
}

const fail = (req, res, next, err = null) => {
  // validation or authentication failed
  err ? console.log(err) : null;
  req.user = undefined;
  return next();
}
