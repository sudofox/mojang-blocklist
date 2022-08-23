// fetch the blacklisted servers from https://sessionserver.mojang.com/blockedservers and stick it in data/current.txt

// import http, path, and fs
var http = require('https');
var path = require('path');
var fs = require('fs');

var current_path = path.join(__dirname, 'data', 'current.txt');

// fetch the blacklisted servers from https://sessionserver.mojang.com/blockedservers
http.get('https://sessionserver.mojang.com/blockedservers', function(res) {
    var body = '';
    res.on('data', function(chunk) {
        body += chunk;
    }).on('end', function() {

        // write the blacklisted servers to data/current.txt
        fs.writeFile(current_path, body, function(err) {
            if (err) {
                console.log(err);
            }
        });
    })
  })
