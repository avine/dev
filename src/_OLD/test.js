/* global define */

(function (root, factory) {

  if ('function' === typeof define && define.amd) {
    define(factory);
  } else if ('object' === typeof exports) {
    module.exports = factory();
  } else {
    root.avine = root.avine || {};
    root.avine.tool = factory();
  }

}(this, function () {

  var tool = {
    version: 1
  };

  return tool;

}));

/*
(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    root.YourModule = factory(root.jQuery);
  }

}(this, function (jquery) {

  return {};

}));
*/