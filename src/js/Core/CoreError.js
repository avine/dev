/*! @author: Stephane Francel - Avine.fr */
'use strict';

export default class CoreError extends Error {
  constructor(message, fileName, lineNumber) {
    super(message, fileName, lineNumber);
    this.name = this.constructor.name;
    this.message = 'Core error occured: ' + message;
  }
}
