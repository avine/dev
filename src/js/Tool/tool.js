/*! @author: Stephane Francel - Avine.fr */
'use strict';

/**
 * Determines or checks the type of `data`.
 * 
 * @param {*} data - The data to be analyzed.
 * @param {String|String[]} [type] - The expected type(s).
 * 
 * @returns {String|Boolean}
 * Returns the type of the `data` as string.
 * If the parameter `type` is set then matches the `data` against the expected types(s) as boolean.
 * 
 * @example
 * typeOf({}); // = object
 * typeOf({}, 'object'); // = true
 * typeOf({}, ['object', 'string']); // = true
 * typeOf({}, ['array', 'string']); // = false
 */
export function typeOf(data, type) {
  var t = Object.prototype.toString.call(data).toLowerCase().match(/\[object\s([a-z]+)\]/)[1];
  return arguments.length < 2 ? t : -1 !== [].concat(type).indexOf(t);
}

/**
 * Checks the type of `data`.
 *
 * @example
 * is.number(1); // = true
 * is.string('a'); // = true
 * is.string(new String('a')); // = true
 * is.string({}); // = false
 */
export class is {

  /** Check if the `data` is a boolean.
   * @param {*} data - The data to be checked.
   * @returns {Boolean} */
  static boolean(data) {
    return typeOf(data, 'boolean');
  }
  /** Check if the `data` is a number.
   * @param {*} data - The data to be checked.
   * @returns {Boolean} */
  static number(data) {
    return typeOf(data, 'number');
  }
  /** Check if the `data` is a string.
   * @param {*} data - The data to be checked.
   * @returns {Boolean} */
  static string(data) {
    return typeOf(data, 'string');
  }
  /** Check if the `data` is an array.
   * @param {*} data - The data to be checked.
   * @returns {Boolean} */
  static array(data) {
    return typeOf(data, 'array');
  }
  /** Check if the `data` is an object.
   * @param {*} data - The data to be checked.
   * @returns {Boolean} */
  static object(data) {
    return typeOf(data, 'object');
  }
  /** Check if the `data` is a function.
   * @param {*} data - The data to be checked.
   * @returns {Boolean} */
  static function(data) {
    return typeOf(data, 'function');
  }

}

/**
 * Class of static methods for manipulating strings.
 */
export class string {

  /**
   * Removes all leading and trailing space characters from the string.
   * 
   * @param {String} str - The string to process.
   * @returns {String}
   */
  static trim(str) {
    return (str || '').replace(/\s+/g, ' ').replace(/^\s|\s$/g, '');
  }

  /**
   * Splits the string into an array of substrings using separator(s)
   * and apply string.trim to its parts.
   * 
   * @param {String} str - The string to process.
   * @param {String|RegExp} sep - The separator to use to split the string.
   * @param {Boolean} [skipEmpty=true] - Skip the array items that are empty strings
   * @returns {Array}
   */
  static split(str, sep, skipEmpty = true) {
    var split = [];
    (str || '').split(sep).forEach(s => {
      s = string.trim(s);
      if (s || !skipEmpty) split.push(s);
    });
    return split;
  }

}

/**
 * Class of static methods for manipulating arrays.
 */
export class array {

  /**
   * Determine whether the `value` exists in the `array` items.
   * 
   * @param {*} value - The value to check.
   * @param {Array} array - The array.
   * @param {Boolean} [strict=true] - Use strict comparison.
   * 
   * @returns {Boolean}
   */
  static exists(value, array, strict = true) {
    if (strict && Array.indexOf) return -1 !== array.indexOf(value);
    var isEqual = strict ? (a, b) => a === b : (a, b) => a == b;
    for (let i = 0, n = array.length; i < n; i++) if (isEqual(value, array[i])) return true;
    return false;
  }

  /**
   * Returns an new array of unduplicated values.
   * 
   * @param {Array} array - The original array.
   * @param {Boolean} [strict=true] - Use strict comparison.
   * 
   * @returns {Array}
   */
  static unique(array, strict) {
    var newArray = [];
    array.forEach(item => array.exists(item, newArray, strict) || newArray.push(item));
    return newArray;
  }

}

/**
 * Deep-duplication and merging a collection of variables into a `data`.
 * 
 * @param {*} data
 */
export function extend(data/*, addon1, addon2, ...*/) {
  for (let i = 1; i < arguments.length; i++) {
    if (is.object(arguments[i])) {
      data = data || {};
      for (let j in arguments[i]) {
        if (arguments[i].hasOwnProperty(j)) {
          data[j] = extend(null, arguments[i][j]);
        }
      }
    } else if (is.array(arguments[i])) {
      data = data || [];
      for (let j = 0; j < arguments[i].length; j++) {
        let e = extend(null, arguments[i][j]);
        is.array(data) ? data.push(e) : (data[j] = e);
      }
    } else {
      data = arguments[i];
    }
  }
  return data;
}

/**
 * Return expected signature of arguments.
 * 
 * @param {Array} args
 * @param {Array} types
 * 
 * @returns {Array}
 * 
 * @example
 * signature([1      ], [is.number, is.boolean]) // = [1, undefined]
 * signature([1, true], [is.number, is.boolean]) // = [1, true]
 * signature([true   ], [is.number, is.boolean]) // = [undefined, true]
 */
export function signature(args, types) {
  var s = [], i = 0;
  types.forEach(type => s.push(type(args[i]) ? args[i++] : undefined));
  return s;
}
