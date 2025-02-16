echo "BILLY envs"

pwd
echo "------------------------------------"
env
echo "------------------------------------"

export DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}"

migrate() {
  npx drizzle-kit migrate
}

server() {
  migrate
  command fixtures
  node dist/entry.js server
}

command() {
  node dist/entry.js $@
}

consume() {
  command consume
}

echo "VQ_96"

$@
