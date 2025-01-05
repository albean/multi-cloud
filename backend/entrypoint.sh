echo "BILLY envs"

env
echo "------------------------------------"
ls -la /
echo "------------------------------------"
pwd
echo "------------------------------------"
ls -la
echo "------------------------------------"

export DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}"

migrate() {
  npx drizzle-kit migrate
}

serve() {
  node dist/entry.js serve
}

migrate
serve
