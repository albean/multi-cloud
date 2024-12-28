/app/gitea/gitea admin user create \
  --username developer \
  --admin \
  --password developer \
  --email admin@fbi.com -c /data/gitea/conf/app.ini

/app/gitea/gitea admin user generate-access-token --username developer -c /data/gitea/conf/app.ini --scopes write:user,write:repository --token-name api-setup-v2
