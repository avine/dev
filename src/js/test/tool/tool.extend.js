/* eslint-env mocha */
'use strict';

import chai from 'chai';
var expect = chai.expect;

import { extend } from '../../Tool/tool.js';

describe('tool.extend', function () {

  describe('With Object', function () {
    var data;
    beforeEach(() => data = { a: 0 });

    it('should return the first given argument', function () {
      var _data = extend(data, { b: 1 });
      expect( data ).to.deep.equal({
        a: 0, b: 1
      });
      expect( _data ).to.equal( data );
    });
    it('should accept multiple aguments', function () {
      expect( extend(data, { b: 1 }, { c: 2 }) ).to.deep.equal({ 
        a: 0, b: 1, c: 2
      });
    });
    it('should work with array', function () {
      expect( extend(data, ['a', 'b']) ).to.deep.equal({ 
        a: 0, '0': 'a', '1': 'b' 
      });
    });

  });

  describe('With Array', function () {
    var data;
    beforeEach(() => data = [0]);

    it('should return the first given argument', function () {
      var _data = extend(data, [1]);
      expect( data ).to.deep.equal( [0, 1] );
      expect( _data ).to.equal( data );
    });
    it('should accept multiple aguments', function () {
      expect( extend(data, [1], [2]) ).to.deep.equal( [0, 1, 2] );
    });
    it('should Work with object by adding properties to the array (not items)', function () {
      extend(data, { a: 'A', b: 'B' });
      expect( 'A' === data.a && 'B' === data.b ).to.be.true;
    });

  });

  describe('With undefined as first argument', function () {

    it('should work', function () {
      expect( extend(undefined, { a: 0 }, { b: 1 }) ).to.deep.equal({ a: 0, b: 1 });
      expect( extend(undefined, [0], [1]) ).to.deep.equal([0, 1]);
    });

  });

});
