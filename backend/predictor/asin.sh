#!/bin/bash

filetype='json'
command="amazon-buddy products -k '$@' --country 'MX' --filetype $filetype -n 1"
output=$($command)
file="${output#*:}.$filetype"
echo "File: $file"