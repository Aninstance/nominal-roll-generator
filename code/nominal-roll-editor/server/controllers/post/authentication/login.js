"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validations = require("../../../validators/validations");
const NominalRollModels = require("../../../models/nominal-roll-models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// for docs & api for node-jsonwebtoken, see: https://github.com/auth0/node-jsonwebtoken
module.exports = (req, res, next) => {
    // do validations
    req.check(validations.userSchema);
    req.getValidationResult().then((result) => {
        if (result.isEmpty() && fieldsExist([req.body.password, req.body.email])) {
            NominalRollModels.User.findOneAndUpdate({
                email: req.body.email
            }, {
                $inc: {
                    'tokenCounter': 1
                }
            }, {
                new: true
            }, (err, user) => {
                if (err) {
                    return respond(res, {
                        data: null,
                        success: false,
                        error: 'Authentication system error.',
                        errDetail: err ? err.toString() : null
                    });
                }
                ;
                if (!user) {
                    return respond(res, {
                        data: null,
                        success: false,
                        error: 'User not found.',
                        errDetail: err ? err.toString() : null
                    });
                }
                else if (user) {
                    if (!user.comparePassword(req.body.password)) {
                        return respond(res, {
                            data: null,
                            success: false,
                            error: 'Authentication failed!',
                            errDetail: err ? err.toString() : null
                        });
                    }
                    else {
                        return respond(res, {
                            data: {
                                token: jwt.sign({
                                    _id: user._id,
                                    role: user.role,
                                    tokenIssueNumber: user.tokenCounter.toString()
                                }, 'XK0wUVhaZyvUlwkWy1w5y91POzA1WlYbxx2me', {
                                    expiresIn: (60 * 60) * 24,
                                }),
                                role: user.role // return role in plaintext for use in client
                            },
                            success: true,
                            error: null,
                            errDetail: err ? err.toString() : null
                        });
                    }
                }
            });
        }
        else {
            // failed POST validation
            return respond(res, {
                data: null,
                success: false,
                error: 'A validation error occurred!',
                errDetail: result ? result.array().map(r => r.msg) : null
            });
        }
    });
    function respond(res, jsonToReturn) {
        return res.status(jsonToReturn.error === null ? 200 : 422).json(jsonToReturn);
    }
    ;
    function fieldsExist(fields) {
        return Array.isArray(fields) && fields.filter(f => f).length === fields.length;
    }
};
//# sourceMappingURL=login.js.map