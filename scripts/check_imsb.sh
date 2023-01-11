#!/bin/bash

# previously I was just checking the Twitter page for newly identified hashes to keep things up to date.
# considering that I've contributed dozens of new solves to @BlockedServers, I feel alright doing this

curl -s https://ismyserverblocked.com/lookup-bulk -H "Content-type: application/json" --data-raw "$(jq -s -R 'split("\n") | .[:-1]' data/todo.txt)" \
| jq -r '.[] | .result.hostname' \
| sort -u \
| xargs node try_url.js
