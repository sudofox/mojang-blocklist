// for each line in data/current.txt, if it is in data/identified.txt, print it instead of the line in data/current.txt
// if it is not in data/identified.txt, print the line in data/current.txt

// the usefulness of this is that it allows us to see possible context for unidentified hostnames, to maybe guess what they are

var fs = require('fs');
var current = fs.readFileSync('data/current.txt', 'utf8');
var identified = fs.readFileSync('data/identified.txt', 'utf8');
var currentLines = current.split('\n');
var identifiedLines = identified.split('\n');
var outputLines = [];
currentLines.forEach(function(line) {
  // if any of the lines in identifiedLines starts with the line in currentLines, print the line in identifiedLines
  var identifiedLine = identifiedLines.find(function(identifiedLine) {
    return identifiedLine.startsWith(line);
  });
  outputLines.push(identifiedLine ? identifiedLine : line);
});

// write to data/merged.txt
fs.writeFileSync('data/merged.txt', outputLines.join('\n') + '\n');
console.log('wrote ' + outputLines.length + ' lines to data/merged.txt');