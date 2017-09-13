export = {
  /*
   * "in": commenting out 'in' key checks ALL (params, body, query, headers)
   * "optional: {checkFalsy: true}: allows skipping validation if key does exist but has an empty value. Does NOT work with empty arrays (validating these also needs to be handled in validator definitions).
   */

  recordSchema: {
    'record_id': {
      // in: 'params'
      optional: {
        checkFalsy: true, // empty value allowed if param exists
      },
      isAlphaNumericPlusExtras: {
        errorMessage: 'This is not a valid record ID. What is your game, Sunny Jim?!'
      }
    },
    'soldier_units': {
      // in: 'query',
      optional: {
        checkFalsy: true, // empty value allowed if param exists
      },
      isSoldierUnitArray: {
        errorMessage: 'Soldier units invalid! What is your game, Sunny Jim?!'
      }
    },
    'soldier_surname': {
      // in: 'query',
      optional: {
        checkFalsy: true, // empty value allowed if param exists
      },
      isAlphaNumericPlusExtras: {
        errorMessage: 'A valid surname was not submitted! What is your game, Sunny Jim?!'
      }
    },
    'soldier_firstname': {
      // in: 'query',
      optional: {
        checkFalsy: true, // empty value allowed if param exists
      },
      isAlphaNumericPlusExtras: {
        errorMessage: 'A valid first name was not submitted! What is your game, Sunny Jim?!'
      }
    },
    'soldier_middlenames': {
      // in: 'query',
      optional: {
        checkFalsy: true, // empty value allowed if param exists
      },
      isAlphaNumericPlusExtrasArray: {
        errorMessage: 'You tried to enter an invalid character! What is your game, Sunny Jim?!'
      }
    },
    'soldier_serial_number': {
      // in: 'query',
      optional: {
        checkFalsy: true, // empty value allowed if param exists
      },
      isNumOrNullArray: {
        errorMessage: 'This is not a valid serial number! What is your game, Sunny Jim?!'
      }
    },
    'kia': {
      // in: 'query',
      optional: {
        checkFalsy: true, // empty value allowed if param exists
      },
      isKSU: {
        errorMessage: 'A KIA status is required ("yes", "no", or "unknown").'
      }
    },
    'kiaDate': {
      // in: 'query',
      optional: {
        checkFalsy: true, // empty value allowed if param exists
      },
      isDate: {
        errorMessage: 'The KIA date needs to be a date!'
      }
    },
    'batch': {
      // in: 'query',
      optional: {
        checkFalsy: true, // empty value allowed if query exists
      },
      isNumber: {
        errorMessage: 'The skip parameter needs to be a number!'
      }
    }
  },
  unitSchema: {
    'unit_id': {
      // in: 'params',
      optional: {
        checkFalsy: true, // empty value allowed if param exists
      },
      isAlphaNumericPlusExtras: {
        errorMessage: 'This is not a valid unit ID. What is your game, Sunny Jim?!'
      }
    },
    'unit_name': {
      // in: 'query',
      optional: {
        checkFalsy: true, // empty value allowed if param exists
      },
      isAlphaNumericPlusExtras: {
        errorMessage: 'This is not a valid unit name. What is your game, Sunny Jim?!'
      }
    },
    'batch': {
      // in: 'query',
      optional: {
        checkFalsy: true, // empty value allowed if query exists
      },
      isNumber: {
        errorMessage: 'The skip parameter needs to be a number!'
      }
    }
  },
  rollSchema: {
    '_id': {
      // in: 'params',
      optional: {
        checkFalsy: false, // empty value disallowed if param exists
      },
      isAlphaNumericPlusExtras: {
        errorMessage: 'This is not a valid unit ID. What is your game, Sunny Jim?!'
      }
    },
    'unit_name': {
      // in: 'query',
      optional: {
        checkFalsy: true, // empty value allowed if param exists
      },
      isAlphaNumericPlusExtras: {
        errorMessage: 'This is not a valid unit name. What is your game, Sunny Jim?!'
      }
    },
    'periodFrom': {
      // in: 'query',
      optional: {
        checkFalsy: false, // empty value disallowed if query exists
      },
      isDate: {
        errorMessage: 'The periodFrom field needs to be a date!'
      }
    },
    'periodTo': {
      // in: 'query',
      optional: {
        checkFalsy: false, // empty value disallowed if query exists
      },
      isDate: {
        errorMessage: 'The periodTo field needs to be a date!'
      }
    },
    'type': {
      // in: 'query',
      optional: {
        checkFalsy: false, // empty value disallowed if query exists
      },
      isRollType: {
        errorMessage: 'Roll type is invalid!'
      }
    }
  },
  userSchema: {
    'fullName': {
      // in: 'params',
      optional: {
        checkFalsy: false, // empty value allowed if param exists
      },
      isAlphaNumericPlusExtras: {
        errorMessage: 'This is not a name. What is your game, Sunny Jim?!'
      }
    },
    'email': {
      // in: 'query',
      notEmpty: true,
      optional: {
        checkFalsy: false, // empty value allowed if param exists
      },
      isEmail: {
        errorMessage: 'This is not a valid email. What is your game, Sunny Jim?!'
      }
    },
    'password': {
      // in: 'query',
      notEmpty: true,
      optional: {
        checkFalsy: false, // empty value allowed if query exists
      },
      isAcceptablePassword: {
        errorMessage: 'This is not an acceptable password. What is your game, Sunny Jim?!'
      }
    },
    'role': {
      // in: 'query',
      notEmpty: true,
      optional: {
        checkFalsy: false, // empty value allowed if query exists
      },
      isAlphaNumericPlusExtrasArray: {
        errorMessage: 'This is not an acceptable role. What is your game, Sunny Jim?!'
      }
    },
    'tokenCounter': {
      optional: {
        checkFalsy: false, // empty value allowed if query exists
      },
      isNumber: {
        errorMessage: 'A counter is generally represented by a number!'
      }
    },
    'revokedTokens': {
      optional: {
        checkFalsy: false, // empty value allowed if query exists
      },
      isTokenArray: {
        errorMessage: 'This is not a valid token string array! What are you trying to pull?!'
      }
    }
  },
  administrationSchema: {
    'dummy': {
      // in: 'params',
      optional: {
        checkFalsy: false, // empty value allowed if param exists
      },
      isAlphaNumericPlusExtras: {
        errorMessage: 'This is not a dummy. What is your game, Sunny Jim?!'
      }
    }
  },
};
