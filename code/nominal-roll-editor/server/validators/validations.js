module.exports = {
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
  },
};
