// Note: validators (e.g. isName) & sanitizers are defined in validator-definitions.js

// VALIDATION - here using 'schema' method. For further options see:
// https://www.pincer.io/npm/libraries/express-validator#middleware-options

module.exports = {

  defaultValidation: {
    'soldier_surname': {
      isName: {
        errorMessage: 'Alphabet characters only please!',
      },
    },
    'soldier_firstname': {
      isName: {
        errorMessage: 'Alphabet characters only please!'
      },
    },
    'soldier_middlenames': {
      isNamesCSV: {
        errorMessage: 'Alphabet characters only please!'
      }
    },
    'soldier_units': {
      isAlphaNumericPlusExtrasArray: {
        errorMessage: 'Invalid input - did you select a unit?'
      }
    },
    'soldier_serial_number': {
      isNumOrNullPlusExtra: {
        errorMessage: 'A soldier serial number needs to be a number!'
      }
    },
    'kia': {
      isKSU: {
        errorMessage: 'Invalid input character!'
      }
    },
    'nodate': {
      isBoolean: {
        errorMessage: 'Ignore year checkbox failed to return a boolean!'
      }
    },
    'action': {
      isAction: {
        errorMessage: 'Invalid form action. What are you up to?'
      }
    },
    'record_id': {
      optional: {
        checkFalsy: false
      },
      isAlphaNumericPlusExtras: {
        errorMessage: 'This is not a valid record ID. What is your game, Sunny Jim?!'
      }
    }
  },
  recordIDValidation: {
    'record_id': {
      optional: {
        checkFalsy: false
      },
      isAlphaNumericPlusExtras: {
        errorMessage: 'This is not a valid record ID. What is your game, Sunny Jim?!'
      }
    }
  },
  unit_name_validation: {
    'military_units': {  // military_units are new units added
      optional: {
        checkFalsy: true
      },
      isAlphaNumericPlusExtras: {
        errorMessage: 'Alphabet characters only please!',
      }
    },
    'soldier_units': {  // solider_units are those displayed in the select
      optional: {
        checkFalsy: true
      },
      isAlphaNumericPlusExtrasArray: {
        errorMessage: 'Invalid input - did you select a unit?'
      }
    },
    'record_id': {
      optional: {
        checkFalsy: true
      },
      isAlphaNumericPlusExtras: {
        errorMessage: 'Invalid form action. What are you up to?'
      }
    },
  },
  ensureNameValidation: {
    'soldier_surname': {
      notEmpty: {
        errorMessage: 'Solider Surname field is required!'
      }
    },
    'soldier_firstname': {
      notEmpty: {
        errorMessage: 'Solider First Name field is required!'
      }
    },
  },
  deleteValidation: {
    'param': {
      isAlphaNumeric: {
        errorMessage: 'The record ID was invalid!'
      }
    },
    notEmpty: {
      errorMessage: 'There was no ID parameter!'
    }
  },
  updateUnit: {
    'param': {
      isAlphaNumeric: {
        errorMessage: 'The record ID was invalid!'
      }
    },
    'unit': {
      isAlphaNumericPlusExtras: {
        errorMessage: 'Invalid input - did you select a unit?'
      }
    },
    notEmpty: {
      errorMessage: 'There was no ID parameter!'
    }
  }
};
