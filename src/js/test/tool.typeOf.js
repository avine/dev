/* eslint-env mocha */
'use strict';

import chai from 'chai';
var expect = chai.expect;

import tool from '../tool.js';

var values = {
  boolean : [true, false, new Boolean(true), new Boolean(false)],
  number  : [1, -1, 1e2, new Number(1)],
  string  : ['hello', new String('hello')],
  array   : [[], new Array()],
  object  : [{}, new Object()],
  function: [function () {}, new Function()]
};

describe('Bi.tool.typeOf', function () {

  describe('Bi.tool.typeOf(data)', function () {
    it('should return the data type', function () {
      for (let type in values) {
        values[type].forEach(function (value) {
          // Return value type
          expect( tool.typeOf(value) ).to.equal(type);
        });
      }
    });
  });

  describe('Bi.tool.typeOf(data, type)', function () {
    it('should match data against type', function () {
      for (let type in values) {
        values[type].forEach(function (value) {
          // Check value against type
          expect( tool.typeOf(value, type) ).to.be.true;
          // Check wrong type
          let wrongType = 'string' !== type ? 'string' : 'boolean';
          expect( tool.typeOf(value, wrongType) ).to.be.false;
          // Check against array of types
          expect( tool.typeOf(value, [wrongType, type]) ).to.be.true;
        });
      }
    });
  });

  describe('Bi.tool.is.*(data)', function () {
    it('should match data against *', function () {
      for (let type in values) {
        values[type].forEach(function (value) {
          // Use tool.is.boolean(true), tool.is.string('hello') ...
          expect( tool.is[type](value) ).to.be.true;
          // Check wrong type
          let wrongType = 'string' !== type ? 'string' : 'boolean';
          expect( tool.is[wrongType](value) ).to.be.false;
        });
      }
    });
  });

});
