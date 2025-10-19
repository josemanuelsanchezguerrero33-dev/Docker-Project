-- Crea DB y tabla (el contenedor ya crea la DB por env)
USE appdb;

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  done BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, done) VALUES
  ('Instalar Docker Desktop', TRUE),
  ('Crear Dockerfile', TRUE),
  ('Escribir docker-compose.yml', TRUE),
  ('Probar CRUD desde el navegador', FALSE);
