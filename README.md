# sudofox/mojang-blocklist

I figured I'd try to get a more comprehensive list of the domains blocked by Mojang, so this is my stab at it.

## Background Information

(TODO)

## Useful bash snippets

Get a list of TLDs (idk if this is super up to date)

```
curl -s https://raw.githubusercontent.com/umpirsky/tld-list/master/data/en/tld.txt|grep -Po "\(\K.+?(?=\))" > tld.txt
```

Expand from mc-server-list-scraper

To strip the first subdomain (will make the other subdomains more likely to work), throw this in the mix: `grep -Po "\.\K.*"`

```
awk -F/ '{print $NF}' ../mc-server-list-scraper/results/* |awk -F: '{print $1}' | awk '{print $1" *."$1" *.play."$1" *.mc."$1" play."$1" mc."$1" hub."$1" *.hub."$1" *.minecraft."$1" minecraft."$1" *.jugar."$1" jugar."$1}'|s2n| sort -u | pv -l | xargs -P2 node try_url.js
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

### for big lists of minecraft server urls:

remove first subdomain. replace with *.<domain>. this also strips port numbers and normalizes casing

```
cat minecraftservers_org_scrape.txt| grep -Po ".+?(?=:)" | grep -Po ".+?(?=\.)\K.*" | tr '[[:upper:]]' '[[:lower:]]'|awk '{print "*"$1}'|xargs node try_url.js
```

Do srv lookups for a list of domains

```
cat domains.txt| grep -Po ".+?(?=:)" | tr '[[:upper:]]' '[[:lower:]]'|grep [[:alpha:]]| xargs -I{} -P10 timeout 5 dig srv _minecraft._tcp.{} +short | tee -a domains_srv_resolved.txt 
```

Given a list of raw `dig` output for many srv lookups, filter for domains only and strip the trailing dot:

```
tr ' ' '\n'|egrep [[:alpha:]]|sort -u|grep -Po ".+?(?=\.$)"
```

another thingy similar

```
cat minecraftservers_org_scrape_resolved_srv.txt | tr ' ' '\n'|egrep [[:alpha:]]|grep -Po ".+?(?=\.$)"|tr [:upper:] [:lower:]| sort -u| awk '{print $1" *."$1" play."$1}' | xargs node try_url.js
```

try *.mc or *.play subdomains for existing

```
awk -F= '{print $NF}' data/identified.txt |grep [[:alpha:]]|grep -Po "\*\.\K.*"|awk '{print "*.mc."$1}'|xargs node try_url.js
```

Finding bypassers via SRV...


```
awk -F= '{print $2}' data/identified.txt |sed 's/*.//'|awk '{print "_minecraft._tcp."$1}'|xargs -L1 -P10 dig +short srv |tee srv_re_resolve.txt
cat srv_re_resolve.txt |awk '{print $NF}'|sed 's/\.$//'|xargs node try_url.js
cat srv_re_resolve.txt |awk '{print $NF}'|sed 's/\.$//'|awk '{print "*."$1}'|xargs node try_url.js
cat srv_re_resolve.txt |awk '{print $NF}'|sed 's/\.$//'|awk '{print "*.mc."$1}'|xargs node try_url.js
cat srv_re_resolve.txt |awk '{print $NF}'|sed 's/\.$//'|awk '{print "*.play."$1}'|xargs node try_url.js
```

### hashcat stuff

```sh
# start things
hashcat -m 100 -w3 --session commonsuffix -o cracked.txt -a3 data/todo.txt commonsuffix.hcmask
# resume checkpointed session
hashcat --session commonsuffix --restore
```


