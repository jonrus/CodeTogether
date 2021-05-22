DROP DATABASE collabtext;
CREATE DATABASE collabtext;
\connect collabtext

CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL
);

INSERT INTO users (username, password)
VALUES ('testuser', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q')
