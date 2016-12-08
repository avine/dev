/*! @author: Stephane Francel - Avine.fr */
"use strict";

export default function (selector) {

  var node = document.querySelector(selector);
  if (node) node.innerHTML = "Hello world!";

}
