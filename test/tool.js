/* eslint-env mocha */

var expect = require('chai').expect;
var tool = require('../dist/server/app.js').tool;

describe('Bi.tool.typeOf(data)', function () {

  it('boolean', function () {
    expect(tool.typeOf(true)).to.equal('boolean');
    expect(tool.typeOf(new Boolean(true))).to.equal('boolean');
  });
  it('number', function () {
    expect(tool.typeOf(1)).to.equal('number');
    expect(tool.typeOf(new Number(1))).to.equal('number');
  });
  it('string', function () {
    expect(tool.typeOf('hello')).to.equal('string');
    expect(tool.typeOf(new String('hello'))).to.equal('string');
  });
  it('array', function () {
    expect(tool.typeOf([])).to.equal('array');
    expect(tool.typeOf(new Array())).to.equal('array');
  });
  it('object', function () {
    expect(tool.typeOf({})).to.equal('object');
    expect(tool.typeOf(new Object())).to.equal('object');
  });
  it('function', function () {
    expect(tool.typeOf(function () { })).to.equal('function');
    expect(tool.typeOf(new Function())).to.equal('function');
  });

});

describe('Bi.tool.typeOf(data, type)', function () {

  it('using string to fill type', function () {
    expect(tool.typeOf('hello', 'string')).to.be.true;
    expect(tool.typeOf('hello', 'boolean')).to.be.false;
  });
  it('using array to fill type', function () {
    expect(tool.typeOf('hello', ['boolean', 'string'])).to.be.true;
    expect(tool.typeOf('hello', ['boolean', 'array'])).to.be.false;
  });

});

describe('Bi.tool.is.*(data)', function () {

  it('boolean', function () {
    expect(tool.is.boolean(true)).to.be.true;
    expect(tool.is.boolean('oups')).to.be.false;
  });
  it('number', function () {
    expect(tool.is.number(1)).to.be.true;
    expect(tool.is.number('oups')).to.be.false;
  });
  it('string', function () {
    expect(tool.is.string('hello')).to.be.true;
    expect(tool.is.string(true)).to.be.false;
  });
  it('array', function () {
    expect(tool.is.array([])).to.be.true;
    expect(tool.is.array('oups')).to.be.false;
  });
  it('object', function () {
    expect(tool.is.object({})).to.be.true;
    expect(tool.is.object('oups')).to.be.false;
  });
  it('function', function () {
    expect(tool.is.function(function () {})).to.be.true;
    expect(tool.is.function('oups')).to.be.false;
  });

});
