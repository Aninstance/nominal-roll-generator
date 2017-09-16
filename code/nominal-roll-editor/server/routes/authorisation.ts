import bodyParser = require('body-parser');
import { Router } from 'express';
import { RequestPlusUserInfo } from '../custom_middleware/request-definitions';
const router = Router();
const helpers = require('../controllers/helpers/aninstance-helpers');

const role = Object.freeze({
  superstoat: 'superstoat',
  admin: 'admin',
  user: 'user'
});

const _restrictedRoutes = Object.freeze({
  get: [{
    url: '/api/administration',
    allowedRoles: [role.superstoat]
  },],
  post: [{
    url: '/api/nominal-roll/record',
    allowedRoles: [role.superstoat, role.admin]
  },
  {
    url: '/api/administration',
    allowedRoles: [role.superstoat, role.admin]
  }
  ],
  put: [{
    url: '/api/nominal-roll/record/:record_id',
    allowedRoles: [role.superstoat, role.admin]
  },
  {
    url: '/api/nominal-roll/units/:unit_id',
    allowedRoles: [role.superstoat, role.admin]
  },
  {
    url: '/api/administration',
    allowedRoles: [role.superstoat]
  },
  ],
  delete: [{
    url: '/api/nominal-roll/record/:record_id',
    allowedRoles: [role.superstoat, role.admin]
  },
  {
    url: '/api/nominal-roll/units/:unit_id',
    allowedRoles: [role.superstoat, role.admin]
  },
  {
    url: '/api/administration',
    allowedRoles: [role.superstoat]
  },
  ]
});

const respond = (res, jsonToReturn) => {
  return res.status(jsonToReturn.error === null ? 200 : 401).json(jsonToReturn);
};

const authorised = (allowedRoles, user) => {
  /**
   * @description determine whether user is authorised
   * @param {array} array of allowed user roles
   * @param {array} user object
   * @return {boolean} true|false if user has at least 1 of allowedRoles
   */
  return true ? user && helpers.arrayIntersect(allowedRoles, user.role).length > 0 : false
}

_restrictedRoutes.get.forEach(r => {
  router.get(r.url, bodyParser.urlencoded({
    extended: true
  }), function (req: RequestPlusUserInfo, res, next) {
    if (authorised(r.allowedRoles, req.user)) {
      return next();
    } else {
      const err = 'Unauthorised user!'
      return respond(res, {
        data: null,
        success: false,
        error: 'Access denied!',
        errDetail: err ? err.toString() : null
      })
    }
  })
})
_restrictedRoutes.post.forEach(r => {
  router.post(r.url, bodyParser.urlencoded({
    extended: true
  }), function (req: RequestPlusUserInfo, res, next) {
    console.log(req)
    if (authorised(r.allowedRoles, req.user)) {
      return next();
    } else {
      const err = 'Unauthorised user!'
      return respond(res, {
        data: null,
        success: false,
        error: 'Access denied!',
        errDetail: err ? err.toString() : null
      })
    }
  })
})
_restrictedRoutes.put.forEach(r => {
  router.put(r.url, bodyParser.urlencoded({
    extended: true
  }), function (req: RequestPlusUserInfo, res, next) {
    if (authorised(r.allowedRoles, req.user)) {
      return next();
    } else {
      const err = 'Unauthorised user!'
      return respond(res, {
        data: null,
        success: false,
        error: 'Access denied!',
        errDetail: err ? err.toString() : null
      })
    }
  })
})

_restrictedRoutes.delete.forEach(r => {
  router.delete(r.url, bodyParser.urlencoded({
    extended: true
  }), function (req: RequestPlusUserInfo, res, next) {
    if (authorised(r.allowedRoles, req.user)) {
      return next();
    } else {
      const err = 'Unauthorised user!'
      return respond(res, {
        data: null,
        success: false,
        error: 'Access denied!',
        errDetail: err ? err.toString() : null
      })
    }
  })
})
module.exports = router;
