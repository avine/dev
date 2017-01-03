/* eslint-env mocha */
'use strict';

import chai from 'chai';
var expect = chai.expect;

import { typeOf, is } from '../Tool/tool.js';

var values = {
  boolean : [true, false, new Boolean(true), new Boolean(false)],
  number  : [1, -1, 1e2, new Number(1)],
  string  : ['hello', new String('hello')],
  array   : [[], new Array()],
  object  : [{}, new Object()],
  function: [function () {}, new Function()]
};

describe('tool.typeOf', function () {

  describe('tool.typeOf(data)', function () {
    it('should return the data type', function () {
      for (let type in values) {
        values[type].forEach(function (value) {
          // Return value type
          expect( typeOf(value) ).to.equal(type);
        });
      }
    });
  });

  describe('tool.typeOf(data, type)', function () {
    it('should match data against type', function () {
      for (let type in values) {
        values[type].forEach(function (value) {
          // Check value against type
          expect( typeOf(value, type) ).to.be.true;
          // Check wrong type
          let wrongType = 'string' !== type ? 'string' : 'boolean';
          expect( typeOf(value, wrongType) ).to.be.false;
          // Check against array of types
          expect( typeOf(value, [wrongType, type]) ).to.be.true;
        });
      }
    });
  });

  describe('tool.is.*(data)', function () {
    it('should match data against *', function () {
      for (let type in values) {
        values[type].forEach(function (value) {
          // Use is.boolean(true), is.string('hello') ...
          expect( is[type](value) ).to.be.true;
          // Check wrong type
          let wrongType = 'string' !== type ? 'string' : 'boolean';
          expect( is[wrongType](value) ).to.be.false;
        });
      }
    });
  });

});
