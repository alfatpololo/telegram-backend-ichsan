CREATE DATABASE telegramchat;

CREATE TABLE chats(
  id SERIAL PRIMARY KEY NOT NULL,
  sender INTEGER,
  receiver INTEGER,
  message TEXT
);

CREATE TABLE users(
  id SERIAL PRIMARY KEY NOT NULL,
  fullname character varying(250),
  username character varying(250),
  password text,
  profile_pic text,
  bio text,
  phone character varying(100),
  email character varying(250)
);