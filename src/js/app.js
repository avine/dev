/*! @author: Stephane Francel - Avine.fr */
'use strict';

import tool from './tool.js';
import Core from './Core.js';

var avine = { tool, Core };

if ('object' === typeof window) {
  window.avine = avine;
} else {
  console.log(avine);
}
