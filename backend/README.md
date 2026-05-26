# PHP Watchlist API

The submission deployment serves this PHP endpoint through Apache on the EC2
instance. It connects privately to RDS MySQL over TLS as the restricted
`what2watch_app` database user.

## API Contract

```txt
GET    /php-api/watchlist.php
POST   /php-api/watchlist.php             body: { "anime_id": 171627 }
DELETE /php-api/watchlist.php?anime_id=171627
```

Responses contain the saved AniList IDs for the single MVP user:

```json
{ "watchlist": [171627] }
```

## Server Files

Create the protected database configuration outside Apache's document root:

```bash
sudo mkdir -p /etc/what2watch
sudo cp ~/what2watch/backend/config/database.example.php /etc/what2watch/database.php
sudo chmod 640 /etc/what2watch/database.php
sudo chown root:apache /etc/what2watch/database.php
sudo nano /etc/what2watch/database.php
```

Fill in the RDS endpoint and the `what2watch_app` password on EC2 only.
Do not add `database.php` to Git.

Install the RDS certificate bundle for PHP:

```bash
sudo cp ~/global-bundle.pem /etc/ssl/certs/rds-global-bundle.pem
sudo chmod 644 /etc/ssl/certs/rds-global-bundle.pem
```

Publish the endpoint for Apache:

```bash
sudo mkdir -p /var/www/what2watch-api
sudo cp ~/what2watch/backend/api/watchlist.php /var/www/what2watch-api/watchlist.php
sudo chown -R root:apache /var/www/what2watch-api
sudo chmod 750 /var/www/what2watch-api
sudo chmod 640 /var/www/what2watch-api/watchlist.php
php -l ~/what2watch/backend/api/watchlist.php
```

Install the Apache virtual-host configuration that exposes PHP at `/php-api`
and sends application page requests to Next.js on localhost port `3000`:

```bash
sudo cp ~/what2watch/backend/apache/what2watch.conf /etc/httpd/conf.d/what2watch.conf
sudo apachectl configtest
sudo systemctl restart httpd
```

Run Next.js with the provided service after building the application:

```bash
sudo cp ~/what2watch/deploy/systemd/what2watch.service /etc/systemd/system/what2watch.service
sudo systemctl daemon-reload
sudo systemctl enable --now what2watch
sudo systemctl status what2watch --no-pager
```

## PHP Smoke Test

After Apache is configured, run from EC2:

```bash
curl http://127.0.0.1/php-api/watchlist.php
curl -X POST http://127.0.0.1/php-api/watchlist.php \
  -H 'Content-Type: application/json' \
  -d '{"anime_id":171627}'
curl -X DELETE 'http://127.0.0.1/php-api/watchlist.php?anime_id=171627'
```
