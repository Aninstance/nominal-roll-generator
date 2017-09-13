"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* Validator definitions for expressValidator. Called in index.js. */
const XRegExp = require("xregexp");
module.exports = {
    customValidators: {
        isAlphaNumeric: function (value) {
            if (value) {
                // regex matches: alphanum(upper + lower)
                return XRegExp.test(value, /^[a-zA-Z0-9]{1,500}$/);
            }
            return true;
        },
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
                        if (!XRegExp.test(item, /^[a-zA-Z0-9\- ,.]{1,500}$/) && item !== '') {
                            valid = false;
                        }
                    });
                }
            }
            return valid; // valid if empty or not set
        },
        isTokenArray: function (value) {
            // n.b. validates empty string (&& item !== "")
            let valid = true;
            if (value && value instanceof Array) {
                if (value.length > 0) {
                    value.forEach(function (item) {
                        if (!XRegExp.test(item, /^[a-zA-Z0-9\.]{1,500}$/) && item !== '') {
                            valid = false;
                        }
                    });
                }
            }
            return valid; // valid if empty or not set
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
            return valid; // validate if empty or not set
        },
        isSoldierUnitArray: function (value) {
            // tests whether value is array of SoldierUnit objects
            if (value && Array.isArray(value)) {
                return value.filter(v => {
                    let idTest = v.unit._id ? XRegExp.test(v.unit._id, /^[a-zA-Z0-9]{1,25}$/) : true; // allow pass (true) if no ID
                    let unitNameTest = XRegExp.test(v.unit.unit_name, /^[a-zA-Z0-9\- _,.+|]{1,150}$/);
                    let periodTest = isDateOrEmptyArray(v.unit_period);
                    return idTest && unitNameTest && periodTest;
                }).length > 0; // return true if all tests true thus filtered has element, else false
            }
            return false; // fail validation if value not array or empty
        },
        isKSU: function (value) {
            return XRegExp.test(value, /^(yes\b)$|^(no\b)$|^(unknown\b)$/i);
        },
        isNumber: function (value) {
            return !isNaN(value); // validate if a number, return false to fail if not
        },
        isDate: function (value) {
            if (value) {
                return isDate(value);
            }
            return false; // fail if no value
        },
        isRollType: function (value) {
            if (value) {
                return XRegExp.test(value, /^(ROH\b)$|^(NOM\b)$/i);
            }
            return false; // fail if empty
        },
        isAcceptablePassword: function (value) {
            if (value) {
                // regex matches: alphanum(upper + lower),dash,space,comma,full-stop,(>1, <500).
                return XRegExp.test(value, /^[a-zA-Z0-9\-\_\,\.\+\|*\!\@\#\$\%\^\&\=|+\;\"\<\>]{1,500}$/);
            }
            return true;
        },
    },
    customSanitizers: {
        upperCase: (value) => value ? value.toUpperCase() : '',
        lowerCase: (value) => value ? value.toLowerCase() : '',
        capitalize: (value) => {
            if (Array.isArray(value)) {
                value = value.map(n => capitalize(n));
            }
            else {
                value = capitalize(value);
            }
            return value;
        },
        underscoreToSpace: (value) => {
            return value ? value.replace('_', ' ').trim().toLowerCase() : '';
        },
        soldierUnitsStingsToDates: (value) => {
            /*
             turn date strings(formatted as YYYY-MM-DD) to Date objects (UTC),
             ensuring the array has a max of 2 values (hence the slice)
              */
            value.forEach((v) => {
                // turn array of date strings into array of Date objects
                v.unit_period = v.unit_period.map(p => new Date(`${p}`)).slice(0, 2);
                // sort array of Date objects in order
                v.unit_period.sort((a, b) => a - b);
            });
            return value;
        }
    }
};
function isDateOrEmptyArray(value) {
    if (value && Array.isArray(value)) {
        // pass check if empty array
        if (value.length === 0) {
            return true;
        }
        let checked = value.filter(v => isDate(v));
        return checked.length > 0; // pass true if all values valid date strings, else false
    }
    return false; // fail if value not array or no value
}
function isDate(value) {
    return !isNaN(Date.parse(`${value}`));
}
function capitalize(value) {
    return value
        .toLowerCase().split(' ').map((word) => word[0].toUpperCase() + word.substr(1)).join(' ');
}
//# sourceMappingURL=validator-definitions.js.map