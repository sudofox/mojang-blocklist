// import data/current.txt

var fs = require("fs");
var path = require("path");
var sha1 = require("sha1");

// require at least one argument
if (process.argv.length < 3) {
  console.log("Usage: node try_url.js <url>");
  process.exit(1);
}

// simplify the path definition into a single line
var current_path = path.join(__dirname, "data", "current.txt");
var identified_path = path.join(__dirname, "data", "identified.txt");
// read it into an array (no empty lines)
var current = fs
  .readFileSync(current_path)
  .toString()
  .split("\n")
  .filter((line) => line.length > 0);
var identified_raw = fs
  .readFileSync(identified_path)
  .toString()
  .split("\n")
  .filter((line) => line.length > 0);

var identified = [];
// for identified, split each line into key/value on =
identified_raw.map(function (line) {
  var parts = line.split("=");
  identified[parts[0]] = parts[1];
});

var unidentified = [];
// add any servers that are not in identified to unidentified
current.map(function (line) {
  if (!identified[line]) {
    unidentified.push(line);
  }
});

new_identified = [];

// for each argument on the command line, sha1 it and add check if it is in unidentified
process.argv.map(function (arg) {
  var hash = sha1(arg);
  if (unidentified.indexOf(hash) > -1) {
    // green text
    console.log("\x1b[32m%s\x1b[0m", "Identified " + hash + " as " + arg);
    new_identified[hash] = arg;
  }
});

// merge new_identified with identified
Object.assign(identified, new_identified);

// write identified to stdout
Object.keys(new_identified).map(function (key) {
  console.log(key + "=" + new_identified[key]);
});

// write identified to data/identified.txt (key=value\n) (sorted by key)
if (Object.keys(new_identified).length > 0) {
  var new_identified_string = "";
  Object.keys(identified)
    .sort()
    .map(function (key) {
      new_identified_string += key + "=" + identified[key] + "\n";
    });

  fs.writeFileSync(identified_path, new_identified_string);
}
