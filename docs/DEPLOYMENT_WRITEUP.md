# What2Watch AWS, PHP, and MySQL Deployment Writeup

## Short Presentation Summary

What2Watch is a Next.js anime recommendation application hosted on an Amazon
EC2 Linux server. The Discover page calls AniList through a Next.js API route,
then applies an explainable recommendation scoring algorithm in the
application. The Watchlist is persisted separately: browser actions call a PHP
JSON endpoint running on the EC2 server, and PHP reads from and writes to a
private Amazon RDS for MySQL database.

The important security decision is that the database is not exposed to the
public internet. The public can access the web application on EC2 over HTTP,
but MySQL port `3306` accepts traffic only from the dedicated EC2 connection
security group. The PHP connection to RDS also uses TLS certificate
verification.

```txt
User browser
  |
  | HTTP port 80
  v
Amazon EC2 - Amazon Linux 2023
  Apache httpd
    |-- /php-api/watchlist.php -> PHP/PDO
    |                              |
    |                              | TLS + MySQL port 3306
    |                              v
    |                         Amazon RDS for MySQL
    |
    |-- all other routes -> Next.js on localhost:3000
                           |-- Discover and Watchlist UI
                           |-- /api/anilist -> AniList GraphQL API
```

## AWS Services Used

### AWS Academy Learner Lab

The application was deployed inside an AWS Academy Learner Lab account in the
`us-east-1` region. Learner Lab provides temporary console access and a limited
budget. A lab session ending may stop the EC2 instance. Its disk-backed files
remain, but starting EC2 again can assign a new public IPv4 address and public
DNS hostname.

Practical consequence: the public demo URL works while the lab session is
active and EC2 is running. Before demonstrating the project, start the lab,
wait for EC2 status checks to pass, and copy the current public DNS address.

### Amazon EC2

EC2 is the public application server. It runs one Amazon Linux 2023 virtual
machine containing the Next.js server, Apache, and PHP.

Configured responsibilities:

| Responsibility | Configuration |
| --- | --- |
| Public web traffic | Apache receives requests on TCP port `80` |
| Server administration | SSH on TCP port `22`, restricted to the current administrator IP |
| React/Next.js application | Node.js production server bound to `127.0.0.1:3000` |
| PHP API | Apache executes `/php-api/watchlist.php` |
| Database communication | PHP connects outbound to private RDS MySQL |

The Next.js process is not directly public. Port `3000` is not opened to
internet traffic. Apache is the public entry point and forwards ordinary app
routes internally to Next.js.

### Amazon RDS for MySQL

RDS holds the persistent shared Watchlist data. Standard RDS for MySQL was used
instead of Aurora because this MVP needs one small relational database rather
than a high-scale cluster.

Database configuration used:

| Setting | Configuration |
| --- | --- |
| DB identifier | `what2watch-mysql` |
| Engine | MySQL Community `8.4.9` |
| Instance class | `db.t4g.micro` |
| Storage | `20 GiB` |
| Availability | Single instance / no Multi-AZ deployment |
| Region and AZ | `us-east-1a` |
| Encryption at rest | Enabled |
| Public accessibility | `No` |
| Database port | `3306` |
| IAM database authentication | Disabled |

RDS persists data independently of any one browser. This was verified by
saving an anime from a laptop and seeing it in the Watchlist from a desktop
browser.

### VPC and Security Groups

EC2 and RDS were placed in the same default VPC, allowing private database
communication within the AWS network.

The web-facing EC2 security group permits:

| Inbound Rule | Source | Purpose |
| --- | --- | --- |
| HTTP TCP `80` | `0.0.0.0/0` | Let visitors open the hosted app |
| SSH TCP `22` | Administrator's current public IP only | Permit controlled server administration |

The database is attached to an RDS connection security group such as
`rds-ec2-1`. The RDS console generated a paired EC2 security group such as
`ec2-rds-1`.

The required database rule is:

| Inbound Rule On RDS | Source | Purpose |
| --- | --- | --- |
| MySQL/Aurora TCP `3306` | `ec2-rds-1` security group | Let only the EC2 application server connect to MySQL |

Important security choices:

- RDS does not permit inbound traffic from `0.0.0.0/0`.
- RDS is not publicly accessible.
- EC2 does not expose Next.js port `3000`.
- SSH is not open to all public IP addresses.
- The RDS admin login is not used by the PHP application.

If a manual rule from the public web security group is still present on RDS,
it is also restricted to EC2 resources, but the cleanest final demonstration
is to keep the dedicated `ec2-rds-1` source rule only.

### IAM Usage

No new application IAM user or access key was required. The app does not call
RDS using AWS API credentials; PHP connects using a restricted MySQL account
and password over a private network route with TLS.

Learner Lab controls the AWS console permissions used to create EC2, RDS, and
security groups. IAM database authentication was left disabled because it was
not needed for this one-user PHP/MySQL MVP.

## EC2 Software Stack

### Operating System

The server runs Amazon Linux 2023, installed and updated using `dnf`.

### Node.js, npm, and Next.js

Installed runtime versions used during deployment:

| Technology | Version / Role |
| --- | --- |
| Node.js | `v22.22.2`, runs the Next.js server |
| npm | `10.9.7`, installs and builds the application |
| Next.js | `16.2.3`, serves React pages and the AniList route handler |

The application was cloned from the GitHub `submission` branch and built with:

```bash
npm ci
NEXT_PUBLIC_WATCHLIST_API_URL=/php-api/watchlist.php npm run build
```

`NEXT_PUBLIC_WATCHLIST_API_URL` tells the client-side Watchlist persistence
adapter to call the PHP API rather than its local-development `localStorage`
fallback. Because it is a public client environment setting, it must be
provided again when rebuilding a deployment.

Next.js is kept running with a `systemd` service:

```txt
/etc/systemd/system/what2watch.service
```

The committed source for that service is
`deploy/systemd/what2watch.service`. It runs:

```bash
npm run start -- --hostname 127.0.0.1 --port 3000
```

Binding to `127.0.0.1` ensures that Next.js is reachable through Apache on the
server, but is not itself exposed as a public port.

### Apache HTTP Server

Apache (`httpd`) is the public-facing web server. It listens on port `80` and
serves as a reverse proxy for Next.js while exposing the PHP API path.

The committed Apache virtual-host configuration is:

```txt
backend/apache/what2watch.conf
```

It routes requests this way:

| URL Path | Destination |
| --- | --- |
| `/php-api/*` | PHP files installed at `/var/www/what2watch-api/` |
| All other paths | Next.js at `http://127.0.0.1:3000/` |

The critical ordering is:

```apache
ProxyPass /php-api/ !
ProxyPass / http://127.0.0.1:3000/
```

The first line excludes PHP requests from the catch-all Next.js proxy. Without
it, Apache would send the PHP API request to Next.js instead of executing PHP.

### PHP and PHP-FPM

PHP `8.5.5` and PHP-FPM execute the Watchlist API. The installed modules
included the MySQL/PDO support required to connect to RDS:

```txt
mysqli
mysqlnd
PDO
pdo_mysql
pdo_sqlite
```

The PHP endpoint source is:

```txt
backend/api/watchlist.php
```

It is installed on EC2 at:

```txt
/var/www/what2watch-api/watchlist.php
```

### Git and Deployment Authentication

Git was installed on EC2 so the deployment could pull the `submission` branch
from GitHub. Because the repository is private, cloning used a short-lived,
fine-grained GitHub personal access token with read-only access to the single
repository. That token should be revoked after deployment.

### MariaDB/MySQL Command-Line Client

The MariaDB-compatible client was installed on EC2 to test the private
connection to RDS and perform initial database setup. It was used only as a
client; the production MySQL server is RDS, not a database installed on EC2.

The connection test proved:

```txt
EC2 -> security-group restricted port 3306 -> RDS MySQL
```

## PHP and SQL Implementation

### Database Schema

The application stores a minimal single-user Watchlist. The SQL schema is
committed at `backend/sql/schema.sql`.

```sql
CREATE TABLE watchlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL DEFAULT 1,
  anime_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_saved_anime (user_id, anime_id)
);
```

Column purposes:

| Column | Purpose |
| --- | --- |
| `id` | Internal auto-incrementing primary key |
| `user_id` | Fixed to user `1` for the MVP without login/authentication |
| `anime_id` | AniList identifier for the saved anime |
| `created_at` | Allows newest saves to display first |
| Unique key | Prevents the same user from saving one anime twice |

Only AniList IDs are persisted. When Watchlist renders, the frontend can use
those IDs to fetch display information such as title and cover image from
AniList. This keeps the MySQL requirement focused and explainable.

### Database Users and Permissions

Two MySQL users serve distinct purposes:

| MySQL Login | Purpose | Permissions |
| --- | --- | --- |
| `admin` | Initial RDS/schema/user administration | Broad setup privileges; not used by PHP |
| `what2watch_app` | Runtime login used by PHP | `SELECT`, `INSERT`, and `DELETE` on `what2watch.watchlist` only |

The runtime user was configured to require an SSL/TLS connection:

```sql
CREATE USER 'what2watch_app'@'%'
  IDENTIFIED BY 'PRIVATE_PASSWORD'
  REQUIRE SSL;

GRANT SELECT, INSERT, DELETE
  ON what2watch.watchlist
  TO 'what2watch_app'@'%';
```

The `%` in the MySQL account definition does not make RDS public. Network
access is independently limited by the RDS security group, which permits
database traffic only from EC2.

### PHP Database Access Technology

PHP uses PDO (PHP Data Objects) with the `pdo_mysql` driver. PDO is appropriate
here because it provides a structured database API and supports prepared
statements.

The connection is built from a protected EC2-only configuration file:

```txt
/etc/what2watch/database.php
```

That file contains:

```txt
RDS host endpoint
MySQL port 3306
database name what2watch
runtime username what2watch_app
runtime password
path to the RDS CA certificate bundle
```

The endpoint enables:

```php
PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
PDO::ATTR_EMULATE_PREPARES => false
PDO::MYSQL_ATTR_SSL_CA => $config['ssl_ca']
PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => true
```

Meaning:

- Database failures are handled as exceptions.
- Statements use real database-side parameter binding.
- The PHP-to-RDS connection is encrypted.
- PHP verifies the RDS server certificate against the AWS RDS CA bundle.

### PHP API Routes

The PHP API is deliberately small:

| Method and Path | SQL Operation | Response |
| --- | --- | --- |
| `GET /php-api/watchlist.php` | `SELECT anime_id` for user `1` | Current saved ID array |
| `POST /php-api/watchlist.php` | `INSERT IGNORE` one `anime_id` | Updated saved ID array |
| `DELETE /php-api/watchlist.php?anime_id=...` | `DELETE` one `anime_id` | Updated saved ID array |

Example JSON response:

```json
{ "watchlist": [171627] }
```

Input validation requires a positive integer AniList ID. SQL queries use PDO
prepared statements rather than combining user input into SQL strings, which
reduces SQL injection risk.

### Frontend to PHP Integration

The frontend storage boundary lives in:

```txt
src/app/watchlist/lib/storage.ts
```

In local development, when no API URL is configured, it saves IDs in the
browser using `localStorage`. In the EC2 build, this configuration:

```bash
NEXT_PUBLIC_WATCHLIST_API_URL=/php-api/watchlist.php
```

makes the same React hooks use `fetch()` requests to PHP instead:

```txt
React/TanStack Query
-> storage.ts
-> /php-api/watchlist.php
-> PHP PDO
-> RDS MySQL
```

TanStack Query invalidates/refetches the `watchlist` query after an insert or
delete, which is why the UI updates after saving or removing a title.

### Recommendation Data Versus Watchlist Data

The recommendation engine and SQL persistence are intentionally separate:

| Feature | Data Source / Processing |
| --- | --- |
| Discover candidate anime | AniList GraphQL through Next.js `/api/anilist` |
| Recommendation scores | TypeScript scoring/ranking code in the Next.js app |
| Saved anime IDs | PHP API and RDS MySQL `watchlist` table |

The app does not copy all AniList anime into MySQL or score the full AniList
database. It retrieves candidate anime broadly, scores that candidate set, and
only persists the user's saved IDs.

## Setup Process Performed

### 1. Provision the Network and Server

1. Started the AWS Academy Learner Lab in `us-east-1`.
2. Created an EC2 web security group allowing HTTP `80` publicly and SSH `22`
   only from the current administrator IP.
3. Created an EC2 key pair and saved the downloaded private `.pem` file
   outside the repository.
4. Launched an Amazon Linux 2023 EC2 server with the web security group.

### 2. Provision the Private MySQL Database

1. Opened RDS and selected **Easy create**, **MySQL**, and **Sandbox** to
   obtain a `db.t4g.micro` database instead of an oversized default class.
2. Selected MySQL `8.4.9`.
3. Verified Easy create configured the database with public access disabled,
   encryption enabled, port `3306`, and no Multi-AZ deployment.
4. Created the RDS database named `what2watch-mysql`.

### 3. Restrict Database Network Access

1. Used the RDS-to-EC2 connection workflow to associate the database with the
   EC2 application server.
2. Verified the dedicated security-group relationship:
   `rds-ec2-1` permits MySQL `3306` from `ec2-rds-1`.
3. Verified RDS remained not publicly accessible.
4. Did not open MySQL to personal IP addresses or the internet.

### 4. Connect Securely and Create SQL Objects

1. Connected to EC2 using SSH and the `.pem` key.
2. Installed a MariaDB/MySQL-compatible command-line client.
3. Downloaded/used the AWS RDS CA certificate bundle.
4. Connected from EC2 to RDS using encrypted, certificate-verified TLS.
5. Created the `what2watch` database and `watchlist` table.
6. Created the restricted `what2watch_app` MySQL account with SSL required and
   only `SELECT`, `INSERT`, and `DELETE` table permissions.
7. Verified the app account by inserting and deleting a test watchlist ID.

### 5. Install and Deploy the Application Server

1. Installed Node.js, npm, Git, Apache `httpd`, PHP-FPM, PHP, and PHP MySQL
   modules on EC2.
2. Pulled the GitHub `submission` branch onto EC2.
3. Installed Node dependencies with `npm ci`.
4. Built Next.js with `/php-api/watchlist.php` enabled as the persistence
   endpoint.
5. Installed the private PHP database configuration outside the repository and
   Apache document root.
6. Installed the RDS CA certificate bundle used by PDO TLS verification.
7. Copied the PHP endpoint into the Apache API directory.
8. Installed a `systemd` service that runs Next.js on localhost port `3000`.
9. Installed the Apache virtual host that serves PHP at `/php-api` and proxies
   other traffic to Next.js.

### 6. Verify the Complete Deployment

1. Loaded the public EC2 URL in a browser.
2. Confirmed Discover returned recommendations.
3. Saved an anime to Watchlist.
4. Loaded Watchlist from another computer.
5. Observed the same saved anime on both machines, proving that storage was in
   shared RDS MySQL rather than each browser's local storage.

## Security and Limitations

Security controls implemented:

- Private RDS database with no public accessibility.
- MySQL access allowed only from the EC2 connection security group.
- TLS verification on PHP-to-RDS connections.
- Restricted MySQL runtime user instead of administrator credentials.
- PDO prepared statements and positive-integer API input validation.
- Database configuration stored on EC2 outside source control.
- SSH restricted to the administrator's current IP.

Current limitation:

- The public browser-to-EC2 connection uses HTTP, as shown by the browser's
  `Not Secure` label. RDS traffic is encrypted, but production improvement
  would require a domain name plus HTTPS/TLS at the public web server, for
  example using a certificate and Apache HTTPS configuration.
- Learner Lab may stop EC2 at session expiration. The instructor should view
  the live site during an active lab session, and the public URL may need to be
  updated after EC2 restarts.

## Secrets and Important Files To Protect

Do not place actual secret values in this document, GitHub, screenshots, or a
class presentation.

| Item | Why It Matters | Where To Keep It | Action |
| --- | --- | --- | --- |
| EC2 private key file, `what2watch-key.pem` | Allows SSH administration of EC2 | Private local folder such as `C:\Users\Jacob\.ssh\what2watch-key.pem` | Never commit or share; keep Windows file permissions restricted |
| RDS `admin` password | Allows database administration | Password manager or private secure note | Use only for setup/maintenance; never put in PHP |
| `what2watch_app` password | Allows PHP runtime reads/writes to Watchlist | Password manager and protected EC2 config file only | Do not disclose or commit |
| `/etc/what2watch/database.php` on EC2 | Contains runtime database credentials and endpoint | EC2 filesystem only, with restricted permissions | Keep `root:apache` ownership and mode `640`; never copy into repo |
| GitHub fine-grained personal access token | Allowed EC2 to clone the private repository | Do not retain once deployment succeeds | Revoke after deployment; create a new short-lived read-only token only if redeploying |
| AWS Academy/Learner Lab access | Controls deployed AWS resources and budget | School/AWS account protected by your normal login security | Do not share session access |

Important but not secret:

| Item | Purpose |
| --- | --- |
| RDS endpoint hostname | Address PHP uses to find the database; access is still protected by SG rules and credentials |
| `/etc/ssl/certs/rds-global-bundle.pem` | Public AWS CA certificate bundle used to verify RDS TLS identity |
| EC2 public DNS address | Public website URL; it may change when EC2 stops and starts |
| Security group names and IDs | Evidence of network restrictions; safe to show in class if no credentials appear |

The repository already ignores environment files, `.pem` files, and
`backend/config/database.php`. Before presenting or submitting screenshots,
check that no terminal window displays passwords or token values.

## Useful Class Explanation

A concise spoken walkthrough:

> I hosted the Next.js and PHP parts of What2Watch on one Amazon Linux EC2
> server. Apache is the public entry point: it forwards page and AniList API
> requests to a private Next.js process on localhost port 3000, and executes a
> PHP JSON endpoint for the Watchlist. The PHP endpoint connects with PDO over
> certificate-verified TLS to an Amazon RDS MySQL 8.4 database. RDS is not
> publicly accessible; its security group only accepts MySQL traffic from the
> EC2 application's dedicated security group. The database stores AniList IDs
> for one test user's watchlist, while anime recommendation ranking stays in
> the TypeScript app. I verified persistence by saving an anime on one device
> and viewing the same saved item on another device.

## Reference Documentation

- AWS EC2 security groups:
  <https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html>
- AWS EC2 stop/start behavior:
  <https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-stop-start-works.html>
- AWS RDS MySQL getting started:
  <https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.CreatingConnecting.MySQL.html>
- AWS RDS security groups:
  <https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.RDSSecurityGroups.html>
- AWS RDS MySQL TLS:
  <https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToInstanceSSL.CLI.html>
- Next.js self-hosting:
  <https://nextjs.org/docs/app/guides/self-hosting>
