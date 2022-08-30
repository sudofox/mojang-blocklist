#!/bin/bash


echo "Building potential domain list..."

> domains_to_try.txt

cat minecraftservers_org_scrape.txt| grep -Po ".+?(?=:)" | grep -Po ".+?(?=\.)\K.*" | tr '[[:upper:]]' '[[:lower:]]'|awk '{print "*"$1}' >> domains_to_try.txt
awk -F= '{print $NF}' data/identified.txt |grep [[:alpha:]]|grep -Po "\*\.\K.*"|awk '{print "*.mc."$1}' >> domains_to_try.txt
awk -F= '{print $NF}' data/identified.txt |grep [[:alpha:]]|grep -Po "\*\.\K.*"|awk '{print "*.play."$1}' >> domains_to_try.txt
echo testing{1..999999} >> domains_to_try.txt
awk -F= '{print $2}' data/identified.txt|grep -v ddns|awk -F. '{print $(NF-1)}'|sort -u > middle_segments.txt
curl -s https://raw.githubusercontent.com/umpirsky/tld-list/master/data/en/tld.txt|grep -Po "\(\K.+?(?=\))" > tld.txt
for tld in $(cat tld.txt); do cat middle_segments.txt|awk '{print $1".'$tld'"}';  done >> domains_to_try.txt

echo "Deduping..."
sort -u domains_to_try.txt -o domains_to_try.txt

DOMAIN_COUNT=$(wc -w domains_to_try.txt|awk '{print $1}')
echo "Checking against $DOMAIN_COUNT possible strings..."
cat domains_to_try.txt | pv -l | xargs -P3 node try_url.js
