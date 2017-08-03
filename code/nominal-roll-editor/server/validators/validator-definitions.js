/* Validator definitions for expressValidator. Called in index.js. */
const XRegExp = require('xregexp');

module.exports = {
  customValidators: {
    isAlphaNumericPlusExtras: function (value) {
      if (value) {
        // regex matches: alphanum(upper + lower),dash,space,comma,full-stop,(>1, <500).
        return XRegExp.test(value, /^[a-zA-Z0-9- _,.+|]{1,500}$/);
      }
      return true;
    },
    isAlphaNumericPlusExtrasArray: function (value) {
      // n.b. validates empty string (&& item !== "")
      let valid = true;
      if (value && value instanceof Array) {
        if (value.length > 0) {
          value.forEach(function (item) {
            if (!XRegExp.test(item, /^[a-zA-Z0-9\- ,.]{1,500}$/) && item !== "") {
              valid = false;
            }
          });
        }
      }
      return valid;  // valid if empty or not set false
    },
    isNumOrNullArray: function (value) {
      let valid = true;
      if (value && value instanceof Array) {
        if (value.length > 0) {
          value.forEach(function (item) {
            if (!XRegExp.test(value, /^[0-9, ]{1,55}$/)) {
              valid = false;
            }
          });
        }
      }
      return valid; // validate if empty or not set false
    },
    isSoldierUnitArray: function (value) {
      // tests whether value is array of SoldierUnit objects
      if (value && Array.isArray(value)) {
        return value.filter(v => {
          let idTest = XRegExp.test(v.unit._id, /^[a-zA-Z0-9]{1,25}$/);
          let unitNameTest = XRegExp.test(v.unit.unit_name, /^[a-zA-Z0-9\- _,.+|]{1,25}$/);
          let periodTest = isDateOrEmptyArray(v.unit_period);
          return idTest && unitNameTest && periodTest;
        }).length > 0; // return true if all tests true thus filtered has element, else false
      }
      return false; // fail validation if value not array or empty
    },
    isKSU: function (value) {
      return XRegExp.test(value, /^(yes\b)$|^(no\b)$|^(unknown\b)$/i);
    },
  },
  customSanitizers: {
    upperCase: function (value) {
      return value ? value.toUpperCase() : '';
    },
    underscoreToSpace: function (value) {
      return value ? value.replace('_', ' ').trim().toLowerCase() : '';
    },
    soldierUnitsStingsToDates: function (value) {
      /*
       turn date strings(formatted as YYYY-MM-DD) to Date objects (UTC),
       ensuring the array has a max of 2 values (hence the slice)
        */
      value.forEach(function (v) {
        // turn array of date strings into array of Date objects
        v.unit_period = v.unit_period.map(p => new Date(`${p}`)).slice(0, 2);
        // sort array of Date objects in order
        v.unit_period.sort((a, b) => a - b);
      });
      return value;
    },
    kiaToUpper: function (value) {
      // uppercase value
      return value.toUpperCase();
    }
  }
};

function isDateOrEmptyArray(value) {
  if (value && Array.isArray(value)) {
    // pass check if empty array
    if (value.length === 0) {
      return true;
    }
    let checked = value.filter(v =>
      !isNaN(Date.parse(new Date(`${v}`))));
    return checked.length > 0; // pass true if all values valid date strings, else false
  }
  return false; // fail if value not array or no value
}
