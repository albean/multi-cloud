# read input

CONTAINER_ID=$(docker run -d nginx)

lock_file="/tmp/__app_lock"

log() {
  echo "$@" >> /tmp/log_mc
}

wait_lock() {
  log "Waiting for log"

  [ -e "$lock_file" ] && (echo "Waiting for the lock to be released..." >> /tmp/log_mc; sleep 1; wait_lock)
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
  echo "JSONNNET" >> /tmp/log_mc
  PATCHPATH="$(mktemp)"
  echo "$PATCH" > $PATCHPATH
  cat $PATCHPATH >> /tmp/log_mc
  # JCMD=".[0]"
  JCMD="del(.[0].$JPATH) | .[0].$JPATH = .[1] | .[0]"

  echo $JCMD >> /tmp/log_mc

  create_lock

  mkdir -p build;

  if [ ! -f build/docker-compose.yml ]; then
    echo '{ "services": {} }' > build/docker-compose.yml
  fi

  cat build/docker-compose.yml >> /tmp/log_mc

  local out=$(jq -s "$JCMD" build/docker-compose.yml $PATCHPATH)

  echo $out > build/docker-compose.yml
  echo "PATH: $JPATH" > /tmp/log_mc
  echo "OUTPUT" > /tmp/log_mc
  echo $out > /tmp/log_mc

  release_lock
}

dc_up() {
  echo "dc_up...." >> /tmp/log_mc
  docker compose -p mulit_app -f build/docker-compose.yml --project-directory $(pwd) up -d --build
  echo "DONE" >> /tmp/log_mc
}

cd $CWD
echo "creating..." >> /tmp/log_mc
pwd >> /tmp/log_mc
echo $@ >> /tmp/log_mc
echo $COMMANND >> /tmp/log_mc

$COMMAND

printf '{"success": true, "version": "%s"}\n' "$(date +%Y-%m-%d\ %H:%M)"
