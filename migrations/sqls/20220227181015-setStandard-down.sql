/* Replace with your SQL commands */

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
    img TEXT
);

CREATE TABLE review(
    id SERIAL PRIMARY KEY ,
    menu_id SERIAL REFERENCES menu (menu_id),
    star INTEGER
);


DROP TABLE payment;
DROP TABLE photo_member;
DROP TABLE autentication;
DROP TABLE member_address;
DROP TABLE coupon;
DROP TABLE membership;
DROP TABLE photo_menu;
DROP TABLE review;
DROP TABLE menu;
DROP TABLE member;
DROP TABLE photo_employee;
DROP TABLE employee;


