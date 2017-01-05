/* eslint-env mocha */
'use strict';

import chai from 'chai';
var expect = chai.expect;

import Core from '../../Core/Core.js';

describe('Core.prototype.then', function () {

  it('should push the function in the stack', function (_done_) {

    new Core().then(function () {

      // Using `this.done` method
      setTimeout(() => { this.done('step1'); }, 10);

    }).then(function (result, done) {
      
      expect( result ).to.equal( 'step1' );

      // Using `done` argument
      setTimeout(function() { done('step2'); }, 10);

    }).then(function (result) {
      
      expect( result ).to.equal( 'step2' );
      this.done();

      _done_();
    });

  });

  it('should be able to be nested', function (_done_) {

    new Core().then(function () {

      this.then(function (result) {

        expect( result ).to.equal( 'Step1' );
        this.done('Step2');

      }).then(function (result) {

        expect( result ).to.equal( 'Step2' );
        this.done('Step3');
      });
      this.done('Step1');

    }).then(function (result) {

      expect( result ).to.equal( 'Step3' );
      this.done();

      _done_();
    });

  });

  it('should work with "call" and "apply" parameter', function () {
  
    // Invoke fn.call(this, argsStack[i])
    var call = ['1', '2'];
    new Core().then(function (param) {

      expect( param ).to.equal( call.shift() );
      this.done();
    
    }, [].concat(call)/*, 'call'*/);

    // Invoke fn.apply(this, argsStack[i])
    var apply = [ ['1.1', '1.2'], ['2.1', '2.2'] ];
    new Core().then(function (param1, param2) {

      var current = apply.shift();

      expect( param1 ).to.equal( current[0] );
      expect( param2 ).to.equal( current[1] );
      this.done();

    }, [].concat(apply), 'apply');

  });

});
