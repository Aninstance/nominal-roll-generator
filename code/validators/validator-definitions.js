/* Validator definitions for expressValidator. Called in index.js. */
XRegExp = require('xregexp');

module.exports = {
  customValidators: {
    isName: function(value) {
      // regex matches: alpha (upper + lower), dash, space, >0, <256
      return XRegExp.test(value, /^(?!\d)+[a-zA-Z- ]{0,255}$/);
    },
    isBooleanString: function(value) {
      // validates that the String type corresponds to a boolean true/false value
      return value == 'true' || value == 'false' ? true : false;
    },
    isNamesCSV: function(value) {
      if (value) {
        // regex matches: alpha (upper + lower), dash, space, comma, 0, <256
        return XRegExp.test(value, /^(?!\d)+[a-zA-Z- ,]{0,255}$/);
      } else {
        return true; // validate if empty
      }
    },
    isAlphaNumeric: function(value) {
      if (value) {
        // regex matches: alpha numeric (upper + lower) >1, <256
        return XRegExp.test(value, /^[a-zA-Z0-9]{1,255}$/);
      }
    },
    isNumOrNullPlusExtra: function(value) {
      if (value) {
        // regex matches: alpha numeric (upper + lower) >1, <256
        return XRegExp.test(value, /^[0-9, ]{1,55}$/);
      } else {
        return true; // validate if empty
      }
    },
    isNumOrNullArray: function(value) {
      if (value && value instanceof Array) {
        value.forEach(function(item) {
          // regex matches: alpha numeric (upper + lower), dash, space, comma, full-stop, >1, <256
          if (XRegExp.test(value, /^[0-9, ]{1,55}$/)) {
            return false;
          }
        });
        return true; // validate if hasn't failed during loop and returned false
      }
      return true; // validate if empty
    },
    isAlphaNumericPlusExtras: function(value) {
      if (value) {
        // regex matches: alpha numeric (upper + lower), dash, space, comma, full-stop, >1, <256
        return XRegExp.test(value, /^[a-zA-Z0-9- ,.+|]{1,500}$/);
      }
    },
    isAlphaNumericPlusExtrasArray: function(value) {
      if (value && value instanceof Array) {
        value.forEach(function(item) {
          // regex matches: alpha numeric (upper + lower), dash, space, comma, full-stop, >1, <256
          if (XRegExp.test(item, /^[a-zA-Z0-9- ,.]{1,500}$/)) {
            return false;
          }
        });
        return true;
      }
      return false;
    },
    isKSU: function(value) {
      return XRegExp.test(value, /^(K\b)$|^(S\b)$|^(U\b)$/);
    },
    isAction: function(value) {
      return XRegExp.test(value,
        /^(\Retrieve Records\b)$|^(\Add Record\b)$|^(Update Record\b)$|^(\Generate Roll PDF\b)$/);
    },
  },
  customSanitizers: {
    upperCase: function(value) {
      return value.toUpperCase();
    },
    capitalize: function(value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    capitalizeUnitArray: function(value){
      if (value && value instanceof Array) {
        return value.map(v => [v[0],v[1].replace(/\b\w/g, l => l.toUpperCase())]);
      }
      return null;
    },
    createNamesArray: function(value) {
      // create array from csv
      namesArray = value.split(',').map(item => item.trim());
      // capitalise each element
      namesArray.forEach(function(item) {
        var working = namesArray.pop();
        namesArray.unshift(working.charAt(0).toUpperCase() + working.slice(1));
      });
      return namesArray;
    },
    createNumArray: function(value) {
      // create array from csv
      let numArray = value.split(',').map(item => item.trim());
      return numArray[0] !== '' ? numArray : null; // if just empty element, return null
    },
    military_unit_formatter(value) {
      if (value) {
        // format military unit input
        let unitArray = value.split(',').map(v => v.trim()); // create array of units & trim whitespace
        return formatToDateAndString(unitArray);
      } else {
        return false;
      }
    },
    remove_unit_dates_formatter(value) {
      return value ? removeDatesFromStrings(value) : false;
    },
  }
};

function formatToDateAndString(unitArray) {
  let formatted = [];
  if (unitArray.length) {
    // function to format array of ['1941|test1'] values to array of [Date, String] values
    unitArray.forEach(function(u) {
      let unitDateArray = u.split('+').map(i => i.trim()); // split array value strings seperated by pipe to a new array of 2 values e.g. ['1941', 'test']
      let formattedValueHolder = [];
      unitDateArray.forEach(function(i) {
        // add value as a Date obj to first element of formattedValueHolder array
        if (i.length === 4 && XRegExp.test(i, /^\d+$/)) {
          formattedValueHolder[0] = (new Date(i));
        }
        if (i.length !== 4 || !XRegExp.test(i, /^\d+$/)) {
          // if value was not valid date, but String, add to the 2nd element of formattedValueHolder array (i.e. the unit name)
          formattedValueHolder[1] = (i);
        }
      });
      formatted.push(formattedValueHolder);
    });
  }
  return formatted.length ? formatted : false;
}

function removeDatesFromStrings(unitArray) {
  if (unitArray.length) {
    newArray = unitArray.map(e => e.replace(/[0-9]{4}|-{2}|\|/g, '').trim());
  }
  return newArray.length ? newArray : false;
}
