/* Replace with your SQL commands */

CREATE TABLE photo_content(
    id SERIAL PRIMARY KEY,
    img TEXT
);

CREATE TABLE homepage (
    id SERIAL PRIMARY KEY,
    section INT,
    header TEXT,
    detail TEXT,
    photo_content_id SERIAL REFERENCES photo_content (id)
);

DROP TABLE homepage;
DROP TABLE photo_content;