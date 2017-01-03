/*! @author: Stephane Francel - Avine.fr */
'use strict';

import * as tool from '../Tool/tool.js';

/**
 * This class helps to call asynchronous methods sequentially without using nested functions
 */
export default class Core {

  /**
   * The blabla constructor !
   */
  constructor() {
    this._stack = _emptyStack();
    this.lastResult = undefined; // Public 'dynamic' property
    this.currentMethod = undefined; // Public 'dynamic' property
    var builder = _getBuilder(Core); // = 'buildCore'
    if (this[builder]) this[builder].apply(this, arguments); // Call the builder method (if defined) and propagate arguments
  }

  /**
   * Clone the Core instance to create parallel call stacks and prevent competitors call problems !
   */
  clone(callbacks, listeners) {
    var clone = Object.create(this);
    // Each clone has his own stack
    clone._stack = _emptyStack();
    clone.lastResult = undefined;
    clone.currentMethod = undefined;
    // Overwrite the inherited method 'setter' to affect the clone prototype (the original instance and not the clone instance)
    clone.setter = this.setter.bind(this); // This is equivalent to Object.getPrototypeOf(clone)[key] = value;
    // Clone callbacks and listeners
    if (undefined === callbacks || !!callbacks) {
      clone._stack.callback.failure = [].concat(this._stack.callback.failure);
      clone._stack.callback.complete = [].concat(this._stack.callback.complete);
    }
    if (undefined === listeners || !!listeners) {
      clone._stack.listeners = [].concat(this._stack.listeners);
    }
    return clone;
  }

  /**
   * Set a property to 'this' (just to make this method available for the original and the clones instances)
   */
  setter(key, value) {
    if (undefined === value) {
      delete this[key]; // delete key
    } else {
      this[key] = value; // assign value
    }
  }

  /**
   * Push asynchronous function in the stack 
   * (notice that when it's called in the event handler, it can break the propagation of the last result)
   */
  then(fn, argsStack, invoke) {
    var _f = this._stack.fn;
    if (!_f.length) _f[0] = []; // Init the main stack
    if (undefined === argsStack || !argsStack.length) {
      _f[0].push(fn); // Push the function once in the stack
    } else do {
      if (invoke != 'apply') invoke = 'call'; // Use fn.apply() or fn.call() to invoke the function
      var i = i || 0;
      _f[0].push(function (i) {
        fn[invoke](this, argsStack[i], // Push the function on each set of arguments
          function(r) { this.done(r); }.bind(this), // Make available the 'done' method as parameter (only if invoke='call')
          function(r) { this.fail(r); }.bind(this) // Make available the 'fail' method as parameter (only if invoke='call')
        );
      }.bind(this, i));
    } while (++i < argsStack.length);

    if (!this._stack.start) {
      this._stack.start = true;
      // Schedule the 'done' method to be executed once the current javascript call stack is empty
      /*
      setTimeout(function () { this.done(this.lastResult); }.bind(this), 0); // The first push starts the stack execution
      */this.done(this.lastResult);
    }
    return this;
  }

  /**
   * Push synchronous function in the stack (the 'done' method is invoked automatically)
   */
  queue(fn) {
    return this.then(function () {
      var once = fn.call(this, this.lastResult);
      this.done(this.lastResult); // Propagate the last result
      return once;
    });
  }

  /**
   * Execute asynchronous function immediately after
   * (use this method with caution, because it can break the propagation of the last result)
   */
  now(fn) {
    var _f = this._stack.fn;
    if (!_f.length) _f[0] = [];
    _f[0].unshift(fn); // Execute the function immediately after

    if (!this._stack.start) {
      this._stack.start = true;
      // Schedule the 'done' method to be executed once the current javascript call stack is empty
      setTimeout(function () { this.done(this.lastResult); }.bind(this), 0); // The first push starts the stack execution
    }
    return this;
  }

  /**
   * Call the next asynchronous function in the stack
   */
  done(result) {
    this.lastResult = result; // Make the last result available in the next method as a property
    var _f = this._stack.fn;
    while (_f.length) {
      if (_f[0].length) {
        var fn = _f[0].shift(); // Get the next function in the FIFO stack
        if (_f[0].length) _f.unshift([]); // Dedicate an empty main stack to the next method (defer what remains in the stack)
        var fnCall = function () {
          this.currentMethod = undefined; // Reset the previous method name (in case the next method is anonymous)
          // Call the function in the appropriate context
          // In case the next function is anonymous, make the last result also available as its parameter (in case the argsStack parameter in the 'then' method was empty)
          return fn.call(this, this.lastResult,
            function(r) { this.done(r); }.bind(this),
            function(r) { this.fail(r); }.bind(this)
          );
        }.bind(this);
        // Execute the function (check its return and _stack.loop property to determine whether the function should be looped)
        return 'once' === fnCall() || false === this._stack.loop || this._stack.done.push(fnCall);
      } else {
        _f.shift();
      }
    }
    // When the FIFO stack is empty, it means that the execution is ended
    // (until an asynchronous call to the 'then' method occurs and restarts execution)
    this._stack.start = false; // Make possible the restart of execution
    this._callback('complete'); // Execute registered 'complete' callbacks
    // Loop the stack if requested
    if (this._stack.loop) {
      while (this._stack.done.length) this.then(this._stack.done.shift());
      if (tool.is.number(this._stack.loop)) this._stack.loop--;
    }
  }

  /**
   * Get the number of remaining functions in the stack
   */
  stackLength() {
    for (var length = 0, _f = this._stack.fn, i = 0; i < _f.length; i++) length += _f[i].length;
    if (this._stack.start) length++; // Add to length the asynchronous function which is being executed
    return length;
  }

  /**
   * Empty the stack (use it instead of the 'done' method when something wrong occurred)
   */
  fail(data) {
    this._callback('failure', data); // Execute registered 'failure' callbacks
    tool.extend(this._stack, { fn: [], start: false, stop: false, loop: false, done: [] }); // Empty the stack
    this.done(this.lastResult); // Calling 'done' method on an empty stack will just execute registered 'complete' callbacks
  }

  /**
   * Empty the stack from the main stack (immediately after)
   */
  nowFail(data) {
    return this.now(function () {
      this.fail(data);
    });
  }

  /**
   * Call the 'done' method of another Core instance
   */
  thenDone(_this) {
    if (this === _this) {
      tool.console.error('Bi.Core.thenDone: Improper use of the method. ' +
        'Instead of calling this.thenDone(this) simply call this.done().');
      this.done(); // Fallback
      return this;
    }
    return this.then(function (result) {
      _this.done(result); // Export the last result to external instance
      this.done();
    });
  }

  /**
   * Call the 'done' method after all listed cores are ended. Use this method instead of: .done()
   */
  doneWhen(/* core1, core2, ... */) {
    var callDone = function (args) {
      for (var results = [], i = 0; i < args.length; i++) results.push(args[i].lastResult);
      this.done(results);
    }.bind(this, arguments);
    for (var cores = [], length = 0, i = 0; i < arguments.length; i++) {
      if (arguments[i].stackLength()) cores.push(arguments[i].onComplete(function () {
        if (++length === cores.length) callDone();
      }));
    }
    if (!cores.length) callDone();
    return this;
  }

  /**
   * Call the 'done' method after all listed cores are ended. Use this method instead of: .then()
   */
  when(/* core1, core2, ... */) {
    for (var cores = [], i = 0; i < arguments.length; i++) cores.push(arguments[i].stop()); // Stop each core
    return this.then(function () {
      for (var i = 0; i < cores.length; i++) cores[i].restart(); // Restart each core
      this.doneWhen.apply(this, cores);
    });
  }

  /**
   * Delay the stack execution
   */
  delay(duration, once) {
    return this.then(function (result) {
      setTimeout(function () {
        this.done(result); // Propagate the last result
      }.bind(this), duration);
      if (once) return 'once';
    });
  }

  /**
   * Stop the stack execution immediately (or as soon as possible)
   */
  stop(callback, useThen) {
    if (!this._stack.fn.length || this._stack.stop) return this;
    this._stack.stop = true;
    var fn = function () {
      if (callback) callback.call(this);
      // Omit the instruction this.done(); (whose call is deferred to the 'restart' method)
      return 'once';
    };
    return useThen ? this.then(fn) : this.now(fn);
  }

  /**
   * Restart the stack execution after it was stopped
   */
  restart(callback) {
    if (!this._stack.fn.length || !this._stack.stop) return this;
    delete this._stack.stop;
    if (callback) callback.call(this);
    this.done(this.lastResult); // Call the 'done' method outside the scope of the 'then' method (and propagate the last result)
    return this;
  }

  /**
   * Loop the stack execution (false to disable the functions record.
   * 0 for record without loop. 1,2,... to loop n times. true to infinite loop)
   */
  loop(count) {
    if (this._stack.loop) return this;
    return this.then(function (result) {
      this._stack.loop = (undefined === count) || count;
      this.done(result); // Propagate the last result
      return 'once'; // Prevent nested calls !
    });
  }

  /**
   * Get the remaining count of loops
   */
  loopCount() {
    return this._stack.loop;
  }

  /**
   * Erase the list of recorded functions
   */
  erase(callback) {
    if (!this._stack.loop) return this;
    tool.extend(this._stack, { loop: false, done: [] });
    if (callback) callback.call(this);
  }

  /**
   * Register callback on failure
   */
  onFailure(fn, once) {
    fn._once = !!once;
    this._stack.callback.failure.push(fn);
    return this;
  }

  /**
   * Register callback on complete
   */
  onComplete(fn, once) {
    fn._once = !!once;
    this._stack.callback.complete.push(fn);
    return this;
  }

  /**
   * Execute registered callbacks
   */
  _callback(type, data) {
    var fn = this._stack.callback[type], newFn = [];
    for (var i = 0; i < fn.length; i++) {
      fn[i].call(this, data);
      fn[i]._once || newFn.push(fn[i]);
    }
    this._stack.callback[type] = newFn;
  }

}

/**
 * Get an empty stack
 * @private
 */
function _emptyStack() {
  return {
    fn: [], // The stack of functions to execute sequentially
    start: false, // Is execution started ?
    stop: false, // Is execution stopped ?
    loop: false, // Is execution in loop ?
    done: [], // Record of each executed function in its context (if loop!==false)
    callback: { failure: [], complete: [] },
    listeners: []
  };
}

/**
 * Get the unique name of the custom constructor for Core or one of its modules
 * @private
 */
function _getBuilder(_Core) {
  return 'build' + (_Core.modulePath || 'Core').replace(/\./g, '');
}
