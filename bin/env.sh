#!/bin/bash

write() {
  file=$1
  key=$2
  value=$3

  lines=$(cat $file)
  exists=$(echo "$lines" | grep -c "^$key=")

  if [ $exists -eq 0 ]; then
    echo "$key=$value" >> $file
  else
    updated_lines=$(echo "$lines" | awk -v k="$key" -v v="$value" 'BEGIN{FS=OFS="="} $1==k{$2=v} 1')
    echo "$updated_lines" > $file
  fi
}

read() {
  file=$1
  key=$2

  lines=$(cat $file)
  value=$(echo "$lines" | awk -F= -v k="$key" '$1==k{print $2}')

  echo $value
}

$@
