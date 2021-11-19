-- All Command For Postgres Database

CREATE DATABASE coffeeshop;

CREATE TABLE menu(
    menu_id SERIAL PRIMARY KEY,
    menu_name VARCHAR(255),    
    menu_price Integer,   
    amount_menu Integer
);