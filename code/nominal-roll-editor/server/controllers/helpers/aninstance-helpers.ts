/* Helper functions
 Author: Dan Bright, productions@aninstance.com
 */
const XRegExp = require('xregexp');

module.exports = {

  flattenArray: function (arr) {
    if (Array.isArray(arr)) {
      // function to flatten multiple arrays to one
      var cleaned = this.removeUndefinedValues(arr);
      return cleaned.reduce((currentState, nextValue) =>
        currentState.concat(Array.isArray(nextValue) ? this.flattenArray(nextValue) : nextValue), []);
    }
    return false;
  },

  removeDuplicates: function (arr) {
    if (Array.isArray(arr)) {
      // function to remove duplicates from an array
      let uniqueList: Array<any> = [];
      arr.forEach(u => uniqueList.includes(u) ? null : uniqueList.push(u));
      return uniqueList;
    }
    return false;
  },

  removeUndefinedValues: function (arr) {
    if (Array.isArray(arr)) {
      // function to remove 'undefined' values from array
      return arr.filter(item => typeof (item) !== 'undefined');
    }
    return false;
  },

  uniqueListFromObjPropLists: function (objs, objectProp) {
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

  removeDatesFromStrings: function (unitArray) {
    let newArray: Array<String> = [];
    if (unitArray.length) {
      newArray = unitArray.map(e => e.replace(/[0-9]{4}|-{2}|\|/g, '').trim());
    }
    return newArray.length ? newArray : false;
  },

  /**
   * @description determine values present in two different arrays.
   * @param {array} arr1 first array.
   * @param {array} arr2 second array.
   * @return {array} new array containing only values present in arr1 & arr1, or empyty array if no matching values or params were not arrays
   */
  arrayIntersect: (arr1, arr2) => Array.isArray(arr1) && Array.isArray(arr2) ? arr1.filter(e => arr2.indexOf(e) > -1) : []

};
