/* Replace with your SQL commands */

CREATE TABLE menu_stocks
(
    id       SERIAL PRIMARY KEY,
    menu_id  SERIAL REFERENCES menu (id),
    quantity NUMERIC(8, 2)
);

DROP TABLE menu_stocks;
