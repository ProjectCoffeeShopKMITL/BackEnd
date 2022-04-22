/* Replace with your SQL commands */

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    firstname TEXT,
    lastname TEXT,
    phone_no VARCHAR(10),
    address TEXT,
    note TEXT,
    order_timestamptz TIMESTAMPTZ,
    menu_array TEXT[][],
    subtotal NUMERIC(8, 2),
    discount NUMERIC(8, 2),
    shipping NUMERIC(8, 2),
    total NUMERIC(8, 2)
);