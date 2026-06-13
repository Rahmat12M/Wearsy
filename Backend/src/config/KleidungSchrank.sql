
CREATE DATABASE final_db;
 
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  anrede VARCHAR(50),
  vorname VARCHAR(100),
  nachname VARCHAR(100),
  geburtstag DATE,
  email VARCHAR(255) UNIQUE NOT NULL,
  stadt VARCHAR(50),
  land VARCHAR(50),
  password VARCHAR(255) NOT NULL,
  profile_image TEXT
);
 
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  text VARCHAR(255),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
 
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  text TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);