<?php

declare(strict_types=1);

const WATCHLIST_USER_ID = 1;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

/**
 * @param array<string, mixed> $payload
 */
function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_THROW_ON_ERROR);
    exit;
}

function animeIdFromValue(mixed $value): int
{
    $id = filter_var($value, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1],
    ]);

    if ($id === false) {
        throw new InvalidArgumentException('anime_id must be a positive integer.');
    }

    return $id;
}

/**
 * @return int[]
 */
function readWatchlist(PDO $database): array
{
    $statement = $database->prepare(
        'SELECT anime_id
         FROM watchlist
         WHERE user_id = :user_id
         ORDER BY created_at DESC, id DESC'
    );
    $statement->execute(['user_id' => WATCHLIST_USER_ID]);

    return array_map(
        static fn (array $row): int => (int) $row['anime_id'],
        $statement->fetchAll()
    );
}

/**
 * @param array<string, mixed> $config
 */
function connectToDatabase(array $config): PDO
{
    $requiredFields = ['host', 'port', 'database', 'username', 'password', 'ssl_ca'];

    foreach ($requiredFields as $field) {
        if (!isset($config[$field]) || $config[$field] === '') {
            throw new RuntimeException("Database configuration field is missing: {$field}");
        }
    }

    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
        $config['host'],
        (int) $config['port'],
        $config['database']
    );

    return new PDO($dsn, $config['username'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::MYSQL_ATTR_SSL_CA => $config['ssl_ca'],
        PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => true,
    ]);
}

try {
    $configPath = getenv('WHAT2WATCH_DB_CONFIG') ?: '/etc/what2watch/database.php';

    if (!is_file($configPath)) {
        throw new RuntimeException('Database configuration file is not installed.');
    }

    /** @var array<string, mixed> $config */
    $config = require $configPath;
    $database = connectToDatabase($config);
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        respond(200, ['watchlist' => readWatchlist($database)]);
    }

    if ($method === 'POST') {
        /** @var mixed $payload */
        $payload = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);

        if (!is_array($payload) || !array_key_exists('anime_id', $payload)) {
            throw new InvalidArgumentException('Request body must contain anime_id.');
        }

        $animeId = animeIdFromValue($payload['anime_id']);
        $statement = $database->prepare(
            'INSERT IGNORE INTO watchlist (user_id, anime_id)
             VALUES (:user_id, :anime_id)'
        );
        $statement->execute([
            'user_id' => WATCHLIST_USER_ID,
            'anime_id' => $animeId,
        ]);

        respond(201, ['watchlist' => readWatchlist($database)]);
    }

    if ($method === 'DELETE') {
        $animeId = animeIdFromValue($_GET['anime_id'] ?? null);
        $statement = $database->prepare(
            'DELETE FROM watchlist
             WHERE user_id = :user_id AND anime_id = :anime_id'
        );
        $statement->execute([
            'user_id' => WATCHLIST_USER_ID,
            'anime_id' => $animeId,
        ]);

        respond(200, ['watchlist' => readWatchlist($database)]);
    }

    header('Allow: GET, POST, DELETE');
    respond(405, ['error' => 'Method not allowed.']);
} catch (JsonException | InvalidArgumentException $exception) {
    respond(400, ['error' => $exception->getMessage()]);
} catch (Throwable $exception) {
    error_log($exception->getMessage());
    respond(500, ['error' => 'Watchlist service is unavailable.']);
}
