read input

echo "Deleting..." >> /tmp/log
env >> /tmp/log
echo "----" >> /tmp/log
echo $input | jq -C >> /tmp/log
