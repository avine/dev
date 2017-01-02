/*! @author: Stephane Francel - Avine.fr */
'use strict';

import * as tool from './Tool/tool.js';
import Core from './Core/Core.js';

var avine = { tool, Core };
global.avine = avine;
export default avine;
