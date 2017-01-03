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
  it('should works', function () {

    tests.forEach(function (test) {
      expect( signature(test[0], test[1]) ).to.deep.equal( test[2] );
    });

  });
});
