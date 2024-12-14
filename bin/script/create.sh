CONTAINER_ID=$(docker run -d nginx)


printf  '{ "dockerContainerId":  "%s" }' "$CONTAINER_ID"


