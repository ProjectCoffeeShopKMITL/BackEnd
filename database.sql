-- All Command For Postgres Database

CREATE DATABASE coffeeshop;

-- Menu Module 
-- UP
CREATE TABLE menu(
    menu_id SERIAL PRIMARY KEY,
    menu_name TEXT,
    price DECIMAL(19,4),
    menu_description TEXT,
    sale_to DECIMAL(19,4),
    is_recommend BOOLEAN,
    menu_type TEXT,
    time_add TIMESTAMPTZ
);

CREATE TABLE photo_menu(
    photo_menu_id SERIAL PRIMARY KEY ,
    menu_id SERIAL REFERENCES menu (menu_id),
    img TEXT,
    photo_menu_description TEXT
);

-- down
DROP TABLE photo_menu;
DROP TABLE menu;
