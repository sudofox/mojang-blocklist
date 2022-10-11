# sudofox/mojang-blocklist

In September of 2022 I decided to try to identify the strings for all of the entries in Mojang's server blocklist. Through many different methods and approaches, including:

- bruteforcing
- pulling domains from server lists
- contextual analysis
- interviews with former server owners
- historical research
- relying on the work of people who've come before me
- assistance from various cool people

I was able to identify many new strings in the list.

There's some GitHub automation in place to automatically update everything every couple of hours.

## How to help

Obviously, we want to continue to identify more strings. That's really it. If you are able to identify more, please open a PR or an issue!

Take a look at data/todo.txt for hashes that have yet to be cracked.

If you run a Minecraft server list site, you are exactly the kind of person we're looking for that has the resources to help!

## How to use this stuff

- data/current.txt contains the current blocklist, as fetched from https://sessionserver.mojang.com/blockedservers
- data/identified.txt contains all strings which I've identified since starting the project, in the format `hash=string`. It also includes ones that have been since removed from the blocklist.
- data/merged.txt contains the current blocklist but with identified strings merged in. This is the most useful file to use for contextual analysis.

## Adding new stuff

See scratchwork.md for various neat and useful snippets.

Throw whatever you want at `node try_url.js`. If you find something new, run this stuff:

```
npm run update-blocklist ; npm run update-merged; npm run update-todo
```

For some reason, `update-todo` sometimes fails on certain systems, no clue why, but you can just manually run the `comm` command in package.json instead.

Don't prune identified strings that have been removed from identified.txt -- I'm keeping them in there for historical purposes. I might end up adding a separate file for removed strings at some point which would include verified former blocklist entries.

Take a look at the `expandmc` bash function in scratchwork.md

## Background information on the blocklist

Beginning at Minecraft 1.9.3 r2, Mojang started blocking certain Minecraft servers using a blocklist.

From [wiki.vg's documentation](https://wiki.vg/Mojang_API#Blocked_Servers):

> _Clients check the lowercase name, using the ISO-8859-1 charset, against this list. They will also attempt to check subdomains, replacing each level with a `*`. Specifically, it splits based off of the `.` in the domain, goes through each section removing one at a time. For instance, for mc.example.com, it would try `mc.example.com`, `*.example.com`, and `*.com`. With IP addresses (verified by having 4 split sections, with each section being a valid integer between 0 and 255, inclusive) substitution starts from the end, so for `192.168.0.1`, it would try `192.168.0.1`, `192.168.0.*`, `192.168.*`, and `192.*`._

> _This check is done by the bootstrap class in netty. The default netty class is overridden by one in the `com.mojang:netty` dependency loaded by the launcher. This allows it to affect any version that used netty (1.7+)_

The blocklist appears to have three classes of entries:

### Hostnames

This includes wildcards, typos, '?' appended, mixed case, and other anomalies. Minecraft servers don't need to know their own hostname to function, so scanning the Internet for servers isn't very useful (except maybe with rDNS). Checking server lists is a decent way to find them though.

There used to be a way to bypass blocks via rotating SRV records, but this was patched in snapshot 21w13a (Mojira issue MC-136551, "Servers able to bypass EULA blacklist.")

### IPs

This includes RFC1918 IPs. May also include naive classful wildcards, (192.168, etc.).
This set of hashcat masks for all valid IP addresses can be run after every new hash is added:

https://github.com/johnjohnsp1/hexhosts/blob/master/ipv4.hcmask

There aren't many of these. Mojang does not block many IPs in the list. From some of our research, we found that they _used to_ but after one notable incident where they blocked ProxyPipe, they generally shifted direction towards blocking hostnames.

### Test entries

These are not valid DNS FQDNs, or even hostnames (some have spaces, underscores, etc). These often have "dns" and/or "test" in them, with various combinations of separators (including space), case, and appended digits.

## Thanks

Special thanks to:

- @roycewilliams - who has provided a lot of help with identifying various strings through research.
- All the people who have put in work to identify hashes in the past (e.g @Reecepbcups, @theminecoder)
- Various people who have let me look at their data (even if it didn't identify (m)any new hashes) like @Yive and some server list owners
