/* Replace with your SQL commands */

DROP TABLE homepage;
DROP TABLE photo_content;

CREATE TABLE homepage (
    id SERIAL PRIMARY KEY,
    section INT,
    header TEXT,
    detail TEXT
);

CREATE TABLE photo_content (
    id SERIAL PRIMARY KEY,
    img TEXT,
    homepage_id SERIAL REFERENCES homepage (id)
);