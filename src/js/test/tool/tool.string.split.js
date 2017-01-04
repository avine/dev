/* eslint-env mocha */
'use strict';

import chai from 'chai';
var expect = chai.expect;

import { string } from '../../Tool/tool.js';

describe('tool.string.split', function () {
  it('should work', function () {

    expect( string.split(' a  ;  b  ;  ;  c ', ';') ).to.deep.equal( ['a', 'b', 'c'] );
    expect( string.split(' a  ;  b  ;  ;  c ', ';', false) ).to.deep.equal( ['a', 'b', '', 'c'] );

    // Use RegExp for separator
    expect( string.split(' a  ,  b  ;  ,  c ', /,|;/) ).to.deep.equal( ['a', 'b', 'c'] );

  });
});
