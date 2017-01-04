/*! @author: Stephane Francel - Avine.fr */
'use strict';

/**
 * Determine or check the `data` type.
 * 
 * @param {*} data - The data to check.
 * @param {String|String[]} [type] - The expected type(s).
 * 
 * @returns {String|Boolean}
 * Return the `data` type as string.
 * If the `type` argument is filled then match the `data` type against the expected types(s) as boolean.
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
 * A class of static methods that check the `data` type.
 *
 * The type checking uses the function {@link typeOf}.
 *
 * @example
 * is.number(1); // = true
 * is.string('a'); // = true
 * is.string(new String('a')); // = true
 * is.string({}); // = false
 */
export class is {

  /** Check if the `data` type is a boolean.
   * @param {*} data - The data to check.
   * @returns {Boolean} */
  static boolean(data) {
    return typeOf(data, 'boolean');
  }
  /** Check if the `data` type is a number.
   * @param {*} data - The data to check.
   * @returns {Boolean} */
  static number(data) {
    return typeOf(data, 'number');
  }
  /** Check if the `data` type is a string.
   * @param {*} data - The data to check.
   * @returns {Boolean} */
  static string(data) {
    return typeOf(data, 'string');
  }
  /** Check if the `data` type is an array.
   * @param {*} data - The data to check.
   * @returns {Boolean} */
  static array(data) {
    return typeOf(data, 'array');
  }
  /** Check if the `data` type is an object.
   * @param {*} data - The data to check.
   * @returns {Boolean} */
  static object(data) {
    return typeOf(data, 'object');
  }
  /** Check if the `data` type is a function.
   * @param {*} data - The data to check.
   * @returns {Boolean} */
  static function(data) {
    return typeOf(data, 'function');
  }

}

/**
 * A class of static methods for manipulating strings.
 */
export class string {

  /**
   * Remove all leading and trailing space characters from the string.
   * 
   * @param {String} str - The string to process.
   * @returns {String}
   * 
   * @example
   * string.trim('  a b c  '); // = 'a b c'
   */
  static trim(str) {
    return (str || '').replace(/\s+/g, ' ').replace(/^\s|\s$/g, '');
  }

  /**
   * Split the string into an array of substrings using separator(s) and apply string.trim to its parts.
   * 
   * @param {String} str - The string to process.
   * @param {String|RegExp} sep - The separator to use.
   * @param {Boolean} [skipEmpty=true] - Skip the array items that are empty strings.
   * @returns {Array}
   *
   * @example
   * string.split('  a   b   c  ', ' '       ); // = ['a', 'b', 'c']
   * string.split('  a , b ; c  ', /,|;/     ); // = ['a', 'b', 'c']
   * string.split('  a ,   , c  ', ','       ); // = ['a', 'c']
   * string.split('  a ,   , c  ', ',', false); // = ['a', '', 'c']
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
 * Merge the contents of two or more arguments together into the first argument.
 * 
 * This function accepts any number of arguments.
 * 
 * If the first argument is `null` then determine its type from the second argument.
 * 
 * @returns {*} The merging result.
 * 
 * @param {Object|Array|null} data - The argument to which the others are merged.
 * 
 * @returns {*} The merging result.
 * 
 * @example <caption>With objects</caption>
 * let obj = { a:0 };
 * let ext = extend(obj, { b:1 }, { c:2, d:3 }); // = { a:0, b:1, c:2, d:3 }
 * ext === obj; // true
 * obj.a === 0; // true
 * obj.b === 0; // true
 * ...
 * 
 * @example <caption>With arrays</caption>
 * let arr = ['a'];
 * let ext = extend(arr, ['b'], ['c', 'd']); // = ['a', 'b', 'c', 'd']
 * ext === arr; // true
 * arr[0] === 'a'; // true
 * arr[1] === 'b'; // true
 * ...
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
 * Return an expected signature of arguments.
 * 
 * @param {Array} args - List of unnormalized arguments.
 * @param {Function[]} types - List of functions that represents the expected signature.
 * Each function must return true when the given argument has the expected type.
 * 
 * @returns {Array} List of normalized arguments.
 * 
 * @example
 * signature([1      ], [is.number, is.boolean]) // = [1, undefined]
 * signature([1, true], [is.number, is.boolean]) // = [1, true]
 * signature([true   ], [is.number, is.boolean]) // = [undefined, true]
 * signature([true, 1], [is.number, is.boolean]) // = [undefined, true]
 */
export function signature(args, types) {
  var s = [], i = 0;
  types.forEach(type => s.push(type(args[i]) ? args[i++] : undefined));
  return s;
}



// ------ DEPRECATED ------

/**
 * Split the string into an array of substrings using separator(s) and apply string.trim to its parts.
 * 
 * @param {String} str - The string to process.
 * @param {String|RegExp} sep - The separator to use.
 * @param {Boolean} [skipEmpty=true] - Skip the array items that are empty strings.
 * @returns {Array}
 */
/*export function splitString(str, sep, skipEmpty = true) {
  var split = [];
  (str || '').split(sep).forEach(s => {
    s = (s || '').replace(/\s+/g, ' ').replace(/^\s|\s$/g, '');
    if (s || !skipEmpty) split.push(s);
  });
  return split;
}*/

/**
 * A class of static methods for manipulating arrays.
 */
//export class array {

  /**
   * Determine whether the `value` exists in the `array` items.
   * 
   * @param {*} value - The expected value to be found in the array.
   * @param {Array} array - The array.
   * @param {Boolean} [strict=true] - Use strict comparison.
   * 
   * @returns {Boolean}
   */
  /*static exists(value, array, strict = true) {
    if (strict && Array.indexOf) return -1 !== array.indexOf(value);
    var isEqual = strict ? (a, b) => a === b : (a, b) => a == b;
    for (let i = 0, n = array.length; i < n; i++) if (isEqual(value, array[i])) return true;
    return false;
  }*/

  /**
   * Return an new array of unduplicated values.
   * 
   * @param {Array} array - The array to process.
   * @param {Boolean} [strict=true] - Use strict comparison.
   * 
   * @returns {Array}
   */
  /*static unique(array, strict) {
    var newArray = [];
    array.forEach(item => array.exists(item, newArray, strict) || newArray.push(item));
    return newArray;
  }*/

//}
