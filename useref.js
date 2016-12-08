
var fs = require("fs");
var useref = require("useref");

var index = fs.readFileSync("src/index.html", "utf8");
var bundle = useref(index);

// Copy the index.html content into dev.html
fs.writeFileSync("dist/dev.html", index, "utf8");

// index.html becomes now the production file!
fs.writeFileSync("dist/index.html", bundle[0], "utf8");
