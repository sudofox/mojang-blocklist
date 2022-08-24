# sudofox/mojang-blacklist

I figured I'd try to get a more comprehensive list of the domains blocked by Mojang, so this is my stab at it.

## useful bash snippets

Get a list of TLDs (idk if this is super up to date)

```
curl -s https://raw.githubusercontent.com/umpirsky/tld-list/master/data/en/tld.txt|awk '{print $1}' > tld.txt
```

Get the middle segment (part before the TLD) of all entries, excluding ddns.net, spit it out as *.string

```
awk -F= '{print $2}' data/identified.txt|grep -v ddns|awk -F. '{print $(NF-1)}'|sort -u > middle_segments.txt
```

For all TLDs in tld.txt, try *.string.tld (try also: no subdomain, `play.`, `mc.`, etc)

```
for tld in $(cat tld.txt); do cat middle_segments.txt|awk '{print $1".'$tld'"}';  done|pv -l |xargs -P3 node try_url.js
```

Get a list of hashes which have not yet been identified

```
comm -23 <(sort -u data/current.txt) <(awk -F= '{print $1}' data/identified.txt |sort -u) > todo.txt
```

# for big lists of minecraft server urls:

remove first subdomain. replace with *.<domain>. this also strips port numbers and normalizes casing

```
cat minecraftservers_org_scrape.txt| grep -Po ".+?(?=:)" | grep -Po ".+?(?=\.)\K.*" | tr '[[:upper:]]' '[[:lower:]]'|awk '{print "*"$1}'|xargs node try_url.js
```

Given a list of raw `dig` output for many srv lookups, filter for domains only and strip the trailing dot:

```
tr ' ' '\n'|egrep [[:alpha:]]|sort -u|grep -Po ".+?(?=\.$)"
```
