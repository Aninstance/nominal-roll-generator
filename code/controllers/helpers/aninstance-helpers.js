/* Helper functions
 Author: Dan Bright, productions@aninstance.com
 */
const XRegExp = require('xregexp');

module.exports = {

  flattenArray: function(arr) {
    if (Array.isArray(arr)) {
      // function to flatten multiple arrays to one
      var cleaned = this.removeUndefinedValues(arr);
      return cleaned.reduce((currentState, nextValue) =>
        currentState.concat(Array.isArray(nextValue) ? this.flattenArray(nextValue) : nextValue), []);
    }
    return false;
  },

  removeDuplicates: function(arr) {
    if (Array.isArray(arr)) {
      // function to remove duplicates from an array
      var uniqueList = [];
      arr.forEach(u => uniqueList.includes(u) ? null : uniqueList.push(u));
      return uniqueList;
    }
    return false;
  },
  removeUndefinedValues: function(arr) {
    if (Array.isArray(arr)) {
      // function to remove 'undefined' values from array
      return arr.filter(item => typeof(item) !== 'undefined');
    }
    return false;
  },

  uniqueListFromObjPropLists: function(objs, objectProp) {
    /* returns single array of unique values for an object property (objectProp)
     that exists within an array of objects (objs)
     */
    if (objs.length > -1) {
      var allLists = objs.map(o => o[objectProp]); // create a list obj property values lists
      var flattened = this.flattenArray(allLists); // flatten obj property values list to a single list
      var uniqueList = this.removeDuplicates(flattened); // remove duplicates from the flattened list
      return uniqueList;
    }
    return false;
  },
  formatToDateAndString: function(unitArray) {
    // seperator is either + or | depending on how function is being used. Determine which.
    let seperator = unitArray.includes('+') ? '+' : '|';
    let formatted = [];
    if (unitArray.length) {
      // function to format array of ['1941+test1'] values to array of [Date, String] values
      unitArray.forEach(function(u) {
        let unitDateArray = u.split(seperator).map(i => i.trim()); // split array value strings seperated by pipe to a new array of 2 values e.g. ['1941', 'test']
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
  },
  removeDatesFromStrings: function(unitArray) {
    if (unitArray.length) {
      newArray = unitArray.map(e => e.replace(/[0-9]{4}|-{2}|\|/g, '').trim());
    }
    return newArray.length ? newArray : false;
  },
  getUniqueNamesWithDateRange: function(dateUnitList) {
    // takes array of [Date, String]'s & returns uniques in form of [[Earlist found Date, Latest found Date, String]]
    let unique = []; // this will be  [earlist Date, latest Date, unit name]
    if (dateUnitList instanceof Array) {
      let nameSeen = [];
      dateUnitList.forEach(function(u) {
        if (!nameSeen.includes(u[1])) {
          // add to 'seen' list if has not been seen already
          nameSeen.push(u[1]);
          // if name not already in 'seen' list, also add to unique list
          unique.push([u[0], u[0], u[1]]); // [earlist Date, latest Date, unit name]
        } else {
          // if name already seen, check dates against values in unique list and replace if < earliest or > latest
          unique.forEach(function(v) { // loop unique array
            // if names match
            if (v[2] === u[1]) {
              // if date of element being evaluated earlier than that earlist in unit list
              if (u[0] < unique[unique.indexOf(v)][0]) {
                unique[unique.indexOf(v)][0] = u[0]; // replace the unit list earliest date with the earlier one
              }
              // if date of element being evaluated laster than latest in unit list
              if (u[0] > unique[unique.indexOf(v)][1] || unique[unique.indexOf(v)][1] === null) {
                // replace the unit list latest date with the later one
                unique[unique.indexOf(v)][1] = u[0];
              }
            }
          });
        }
      });
    }
    return unique.length ? unique : null;
  },
};
