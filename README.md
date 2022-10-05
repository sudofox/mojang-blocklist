# sudofox/mojang-blocklist

In September of 2022 I decided to try to identify the strings for all of th entries in Mojang's server blocklist. Through many different methods and approaches, including:

- bruteforcing
- pulling domains from server lists
- contextual analysis
- interviews with former server owners
- historical research
- relying on the work of people who've come before me
- assistance from various cool people

I was able to identify many new strings in the list.

There's some GitHub automation in place to automatically update everything every couple of hours.

## How to use this stuff

- data/current.txt contains the current blocklist, as fetched from https://sessionserver.mojang.com/blockedservers
- data/identified.txt contains all strings which I've identified since starting the project, in the format `hash=string`. It also includes ones that have been since removed from the blocklist.
- data/merged.txt contains the current blocklist but with identified strings merged in. This is the most useful file to use for contextual analysis.

## Adding new stuff

Throw whatever you want at `node try_url.js`. See scratchwork.md for various examples of usage. If you find something new, run this stuff:

```
npm run update-blocklist ; npm run update-merged; npm run update-todo
```

For some reason, `update-todo` sometimes fails on certain systems, no clue why, but you can just manually run the `comm` command in package.json instead.

Don't prune identified strings that have been removed from identified.txt -- I'm keeping them in there for historical purposes. I might end up adding a separate file for removed strings at some point which would include verified former blocklist entries.

## Background information on the blocklist

This section intentionally left blank.

## Thanks

Special thanks to:

- @roycewilliams - who has provided a lot of help with identifying various strings.
- All the people who have put in work to identify hashes in the past
- Various people who have let me look at their data (even if it didn't identify (m)any new hashes) like @Yive and some server list owners
