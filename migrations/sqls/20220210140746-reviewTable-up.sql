/* Replace with your SQL commands */

CREATE TABLE review(
    id SERIAL PRIMARY KEY ,
    menu_id SERIAL REFERENCES menu (menu_id),
    star INTEGER
);