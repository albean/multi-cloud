set -xeuo pipefail

cd $CWD;

TAG="$REPO_URL:$(date +'%y-%m-%d_%H-%M')"

echo "docker build -t $TAG --platform linux/amd64 $ARGS -f $DIR/Dockerfile ."
eval "docker build -t $TAG --platform linux/amd64 $ARGS -f $DIR/Dockerfile ."
echo "Pushing to $TAG"
docker push $TAG

printf '{"tag": "%s"}' "$TAG"
