// fetch the blocklisted servers from https://sessionserver.mojang.com/blockedservers and stick it in data/current.txt

// import http, path, and fs
var http = require('https');
var path = require('path');
var fs = require('fs');

var current_path = path.join(__dirname, 'data', 'current.txt');

// first, get the number of hashes that we already have
var current_file = fs.readFileSync(current_path, 'utf8');
var current_hash_count = current_file.split('\n').length;

// fetch the blocklisted servers from https://sessionserver.mojang.com/blockedservers
http.get('https://sessionserver.mojang.com/blockedservers?' + Math.floor(Math.random() * 999999), function(res) {
    var body = '';
    res.on('data', function(chunk) {
        body += chunk;
    }).on('end', function() {

        // count the number of hashes that we have now
        var new_hash_count = body.split('\n').length;

        // if the new hash count is less than 1/2 the old hash count, then abort
        // saw this simple logic used in the BlockedServers checker, figured I'd add it just in case. thanks minecoder
        if (new_hash_count < current_hash_count / 2) {
            console.log('Aborting: new hash count is less than 1/2 the old hash count, assuming something went wrong');
            return;
        }

        console.log("Writing " + new_hash_count + " hashes (old count: " + current_hash_count + ")");

        // write the blocklisted servers to data/current.txt
        fs.writeFile(current_path, body, function(err) {
            if (err) {
                console.log(err);
            }
        });
    })
  })
