/* eslint-env mocha */
'use strict';

import chai from 'chai';
var expect = chai.expect;

import { signature, is } from '../../Tool/tool.js';

var tests = [
  [ [1      ], [is.number, is.boolean], [1, undefined] ],
  [ [1, true], [is.number, is.boolean], [1, true] ],
  [ [true   ], [is.number, is.boolean], [undefined, true] ],
  [ [true, 1], [is.number, is.boolean], [undefined, true] ]
];

describe('tool.signature', function () {
  it('should work', function () {

    tests.forEach(function (test) {

      var args = test[0], types = test[1], result = test[2];
      expect( signature(args, types) ).to.deep.equal( result );

    });

  });
});
