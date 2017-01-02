
'use strict';
/*
var tool = {};

// Return or check data type (type parameter is optional)
//      - If 2 arguments are given then the function is checking data against type and returns a boolean
//        (In this case, type can be a string or an array of strings of the expected types)
//      - Otherwise the function returns the data type as a string in lower case
tool.typeOf = function (data, type) {
  var t = Object.prototype.toString.call(data).toLowerCase().match(/\[object\s([a-z]+)\]/)[1];
  return arguments.length < 2 ? t : -1 !== [].concat(type).indexOf(t);
};

tool.is = {};

['boolean', 'number', 'string', 'array', 'object', 'function'].forEach(function (type) {
  tool.is[type] = function (data) {
    return tool.typeOf(data, type);
  };
});

tool.string = {};

// Removes all leading and trailing space characters from the string
tool.string.trim = function (str) {
  return (str || '').replace(/\s+/g, ' ').replace(/^\s|\s$/g, '');
};

// Splits the string into an array of substrings using separator(s) and apply tool.string.trim to its parts
// The separator is treated as a string or a regular expression.
tool.string.split = function (str, sep, skipEmpty) {
  if (undefined === skipEmpty) skipEmpty = true;
  str = (str || '').split(sep);
  for (var split = [], n = str.length, i = 0; i < n; i++) {
    str[i] = tool.string.trim(str[i]);
    if (str[i] || !skipEmpty) split.push(str[i]);
  }
  return split;
};

tool.string.toNumber = function (str) {
  var num = parseFloat(str);
  if (!isNaN(num) && /^\s*(\+|-)?([0-9]+\.?[0-9]*|\.[0-9]+)(e(\+|-)?[0-9]+)?\s*$/.test(str)) {
    return num; // Looks like a float !
  }
  return NaN;
};

tool.String = class {
  static trim (str) {
    return (str || '').replace(/\s+/g, ' ').replace(/^\s|\s$/g, '');
  }
};
*/

var tool = {

  // Return or check data type (type parameter is optional)
  //      - If 2 arguments are given then the function is checking data against type and returns a boolean
  //        (In this case, type can be a string or an array of strings of the expected types)
  //      - Otherwise the function returns the data type as a string in lower case
  typeOf: function (data, type) {
    var t = Object.prototype.toString.call(data).toLowerCase().match(/\[object\s([a-z]+)\]/)[1];
    return arguments.length < 2 ? t : -1 !== [].concat(type).indexOf(t);
  },

  is: {
    boolean: function (data) {
      return tool.typeOf(data, 'boolean');
    },
    number: function (data) {
      return tool.typeOf(data, 'number');
    },
    string: function (data) {
      return tool.typeOf(data, 'string');
    },
    array: function (data) {
      return tool.typeOf(data, 'array');
    },
    object: function (data) {
      return tool.typeOf(data, 'object');
    },
    function: function (data) {
      return tool.typeOf(data, 'function');
    }
  },

  string: {
    // Removes all leading and trailing space characters from the string
    trim: function (str) {
      return (str || '').replace(/\s+/g, ' ').replace(/^\s|\s$/g, '');
    },

    // Splits the string into an array of substrings using separator(s) and apply tool.string.trim to its parts
    // The separator is treated as a string or a regular expression.
    split: function (str, sep, skipEmpty) {
      if (undefined === skipEmpty) skipEmpty = true;
      str = (str || '').split(sep);
      for (var split = [], n = str.length, i = 0; i < n; i++) {
        str[i] = tool.string.trim(str[i]);
        if (str[i] || !skipEmpty) split.push(str[i]);
      }
      return split;
    },

    toNumber: function (str) {
      var num = parseFloat(str);
      if (!isNaN(num) && /^\s*(\+|-)?([0-9]+\.?[0-9]*|\.[0-9]+)(e(\+|-)?[0-9]+)?\s*$/.test(str)) {
        return num; // Looks like a float !
      }
      return NaN;
    }
  },

  array: {
    // Determine whether value exists in array
    exists: function (value, array, strict) {
      if (undefined === strict) strict = true;
      if (strict && Array.indexOf) return -1 !== array.indexOf(value);
      var isEqual = strict ? function (a, b) { return a === b; } : function (a, b) { return a == b; };
      for (var i = 0, n = array.length; i < n; i++) if (isEqual(value, array[i])) return true;
      return false;
    },

    // Return array of unduplicated values
    unique: function (array, strict) {
      for (var newArray = [], n = array.length, i = 0; i < n; i++)
        if (!tool.array.exists(array[i], newArray, strict)) newArray.push(array[i]);
      return newArray;
    }
  },

  // Duplicate and merge a collection of variables into a data
  extend: function (data/*, addon1, addon2, ...*/) {
    var i, j, n, m, e;
    for (n = arguments.length, i = 1; i < n; i++) {
      if (tool.is.object(arguments[i])) {
        data = data || {};
        for (j in arguments[i]) if (arguments[i].hasOwnProperty(j)) {
          data[j] = tool.extend(null, arguments[i][j]);
        }
      } else if (tool.is.array(arguments[i])) {
        data = data || [];
        for (m = arguments[i].length, j = 0; j < m; j++) {
          e = tool.extend(null, arguments[i][j]);
          tool.is.array(data) ? data.push(e) : (data[j] = e);
        }
      } else {
        data = arguments[i];
      }
    }
    return data;
  },

  // Return expected signature of arguments
  // Examples :
  // avine.tool.signature([1      ], [avine.tool.is.number, avine.tool.is.boolean]) //  [1, undefined]
  // avine.tool.signature([1, true], [avine.tool.is.number, avine.tool.is.boolean]) //  [1, true]
  // avine.tool.signature([true   ], [avine.tool.is.number, avine.tool.is.boolean]) //  [undefined, true]
  signature: function (args, types) {
    for (var s = [], j = 0, i = 0; i < types.length; i++) s[i] = types[i](args[j]) ? args[j++] : undefined;
    return s;
  }

};

// Expose
export default tool;
