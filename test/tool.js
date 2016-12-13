/* eslint-env mocha */

var expect = require('chai').expect;

var tool = require('../dist/server/app.js').tool;

describe('tool.is.boolean', function () {

  it('should be a function', function () {

    expect(typeof tool.is.boolean === 'function').to.be.true;
  });

});
