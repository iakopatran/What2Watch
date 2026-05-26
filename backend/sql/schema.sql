CREATE DATABASE IF NOT EXISTS what2watch
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE what2watch;

CREATE TABLE IF NOT EXISTS watchlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL DEFAULT 1,
  anime_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_saved_anime (user_id, anime_id)
);
