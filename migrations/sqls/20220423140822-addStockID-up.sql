/* Replace with your SQL commands */

DROP TABLE menu_stocks;

CREATE TABLE menu_stocks(
    id SERIAL PRIMARY KEY,
    menu_id SERIAL REFERENCES menu(id),
    stock_id SERIAL REFERENCES stocks(id),
    quantity NUMERIC(8, 2)
);