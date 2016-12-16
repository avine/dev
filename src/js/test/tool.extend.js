/* eslint-env mocha */
'use strict';

import chai from 'chai';
var expect = chai.expect;

import tool from '../tool.js';

describe('Bi.tool.extend', function () {

  describe('With Object', function () {
    var data = { a: 0 };

    it('should return the first given argument', function () {
      var _data = tool.extend(data, { b: 1 });
      expect( _data ).to.equal(_data);
    });
    it('should accept multiple aguments', function () {
      expect( tool.extend(data, { c: 2 }, { d: 3 }) ).to.deep.equal({ 
        a: 0, b: 1, c: 2, d: 3 
      });
    });
    it('should work with array', function () {
      expect( tool.extend(data, ['a', 'b']) ).to.deep.equal({ 
        a: 0, b: 1, c: 2, d: 3, 0: 'a', 1: 'b' 
      });
    });

  });

  describe('With Array', function () {
    var data = [0];

    it('should return the first given argument', function () {
      var _data = tool.extend(data, [1]);
      expect( _data ).to.equal(_data);
    });
    it('should accept multiple aguments', function () {
      expect( tool.extend(data, [2], [3]) ).to.deep.equal([0, 1, 2, 3]);
    });
    it('should Work with object by adding properties to the array (not items)', function () {
      tool.extend(data, { a: 'A', b: 'B' });
      expect( 'A' === data.a && 'B' === data.b ).to.be.true;
    });

  });

  describe('With undefined as first argument', function () {

    it('should work', function () {
      expect( tool.extend(undefined, { a: 0 }, { b: 1 }) ).to.deep.equal({ a: 0, b: 1 });
      expect( tool.extend(undefined, [0], [1]) ).to.deep.equal([0, 1]);
    });

  });

});
