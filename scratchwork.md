# Notes/scratchwork 

## bash functions

```
# expand string to common patterns (feel free to add more subdomains, like "hub", "jugar", "server", etc)
expandmc () { 
    awk '{print $1" play."$1" mc."$1" _minecraft._tcp."$1}' | tr ' ' '\n' | awk '{print $1" *."$1}' | tr ' ' '\n'
}
# space to newline
s2n () {
  tr ' ' '\n'
}

# input: abc
# output: Abc, aBc, abC
function upperall() {
  input=$1
  echo $input
  for (( i=0; i<${#input}; i++ )); do
    changed_char=${input:$i:1}
    echo ${input:0:$i}${changed_char^^}${input:$i+1}
  done
}

# same as above but for each line of piped input
function upperall_piped() {
  while read line; do
    upperall $line
  done
}
```

```sh
$ echo example.com | expandmc 
example.com
*.example.com
play.example.com
*.play.example.com
mc.example.com
*.mc.example.com
_minecraft._tcp.example.com
*._minecraft._tcp.example.com
```

## Various one-liners and bash snippets

Get a list of TLDs (idk if this is super up to date)

```
curl -s https://raw.githubusercontent.com/umpirsky/tld-list/master/data/en/tld.txt|grep -Po "\(\K.+?(?=\))" > tld.txt
```

To strip the first subdomain (will make the other subdomains more likely to work), throw this in the mix: `grep -Po "\.\K.*"`

Get the middle segment (part before the TLD) of all entries, excluding ddns.net, spit it out as `*.string`

```
awk -F= '{print $2}' data/identified.txt|grep -v ddns|awk -F. '{print $(NF-1)}'|sort -u > middle_segments.txt
```

For all TLDs in tld.txt, try `*.string.tld` (try also: no subdomain, `play.`, `mc.`, etc)

```
for tld in $(cat tld.txt); do cat middle_segments.txt|awk '{print $1".'$tld'"}';  done|pv -l |xargs -P3 node try_url.js
```

Get a list of hashes which have not yet been identified

```
comm -23 <(sort -u data/current.txt) <(awk -F= '{print $1}' data/identified.txt |sort -u) > todo.txt
```

### for big lists of minecraft server urls:

remove first subdomain. replace with `*.<domain>`. this also strips port numbers and normalizes casing

```
cat minecraftservers_org_scrape.txt| grep -Po ".+?(?=:)" | grep -Po ".+?(?=\.)\K.*" | tr '[[:upper:]]' '[[:lower:]]'|awk '{print "*"$1}'|xargs node try_url.js
```

### Do srv lookups for a list of domains

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

try `*.mc` or `*.play` subdomains for existing

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

various things

```
../mc-server-list-scraper/scripts/list_all.sh | tr [:upper:] [:lower:] | sort -u | expandmc | tr -d "'" | pv -l | xargs -P5 node try_url.js
../mc-server-list-scraper/scripts/list_all.sh | tr [:upper:] [:lower:] | sort -u | awk -F. '{print $(NF-1)"."$NF}' | expandmc | tr -d "'" | pv -l | xargs -P5 node try_url.js
cat ../wordlists/words_alpha.txt |awk '{print $1"mc",$1"pvp",$1"craft",$1"prison"}'| tr ' ' '\n'| awk '{print $1".com",$1".net",$1".org",$1".co"}'|tr ' ' '\n'| awk '{print "*."$1}'| pv -l | xargs -P6 node try_url.js
```
