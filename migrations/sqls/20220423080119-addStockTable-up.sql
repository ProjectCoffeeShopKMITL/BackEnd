/* Replace with your SQL commands */

CREATE TABLE orders_status
(
    id       SERIAL PRIMARY KEY,
    order_id SERIAL REFERENCES orders (id),
    status   int
);

CREATE TABLE stocks
(
    id              SERIAL PRIMARY KEY,
    ingredient_name TEXT,
    quantity        NUMERIC(8, 2)
);

CREATE TABLE menu_stocks
(
    id       SERIAL PRIMARY KEY,
    menu_id  SERIAL REFERENCES menu (id),
    quantity NUMERIC(8, 2)
);

CREATE TABLE stocks_transaction
(
    id           SERIAL PRIMARY KEY,
    stocks_id    SERIAL REFERENCES stocks (id),
    quantity     NUMERIC(8, 2),
    timeAddStock TIMESTAMPTZ
);