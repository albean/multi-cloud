export DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}"

migrate() {
  npx drizzle-kit migrate
}

server() {
  migrations &
  node dist/entry.js server
}

migrations() {
  migrate
  command fixtures&
}

command() {
  node dist/entry.js $@
}

consume() {
  command consume $@
}

echo "VQ_96"

$@
