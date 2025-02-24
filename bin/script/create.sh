# read input

CONTAINER_ID=$(docker run -d nginx)

lock_file="/tmp/__app_lock"

log() {
  echo "$@" >> /tmp/log
}

wait_lock() {
  log "Waiting for log"

  [ -e "$lock_file" ] && (echo "Waiting for the lock to be released..." >> /tmp/log; sleep 1; wait_lock)
}

create_lock() {
  log "Create lock"
  wait_lock
  rand_str=$(uuidgen)
  echo "$rand_str" > "$lock_file"
  [ "$(cat $lock_file)" = "$rand_str" ] || create_lock
}

release_lock() {
  rm -f "$lock_file"
}

update_compose() {
  echo "JSONNNET" >> /tmp/log
  PATCHPATH="$(mktemp)"
  echo "$PATCH" > $PATCHPATH
  cat $PATCHPATH >> /tmp/log
  # JCMD=".[0]"
  JCMD="del(.[0].$JPATH) | .[0].$JPATH = .[1] | .[0]"

  echo $JCMD >> /tmp/log

  create_lock

  mkdir -p build;

  if [ ! -f build/docker-compose.yml ]; then
    echo '{ "services": {} }' > build/docker-compose.yml
  fi

  cat build/docker-compose.yml >> /tmp/log

  local out=$(jq -s "$JCMD" build/docker-compose.yml $PATCHPATH)

  echo $out > build/docker-compose.yml
  echo "PATH: $JPATH" > /tmp/log
  echo "OUTPUT" > /tmp/log
  echo $out > /tmp/log

  printf '{"success": true, "version": "%s"}\n' "$(date +%Y-%m-%d\ %H:%M)"

  release_lock
}

cup() {
  docker-compose -p mulit_app -f build/docker-compose.yml up -d --build
}

cd $CWD
echo "creating..." >> /tmp/log
pwd >> /tmp/log
echo $@ >> /tmp/log
echo $COMMANND >> /tmp/log

$COMMAND
