/* Replace with your SQL commands */


DROP TABLE review;
DROP TABLE photo_menu;
DROP TABLE menu;



CREATE TABLE menu(
    id SERIAL PRIMARY KEY,
    name TEXT,
    price NUMERIC(8,2),
    description TEXT,
    sale_to NUMERIC(8,2),
    is_recommend BOOLEAN,
    type TEXT,
    create_at TIMESTAMPTZ
);

CREATE TABLE photo_menu(
    id SERIAL PRIMARY KEY,
    img TEXT,
    menu_id SERIAL REFERENCES menu (id)
);

CREATE TABLE member(
    id SERIAL PRIMARY KEY,
    phone_no VARCHAR(10),
    email VARCHAR(24),
    password VARCHAR(50),
    name TEXT,
    gender TEXT,
    birthdate DATE,
    register_date DATE,
    is_verified BOOLEAN
);

CREATE TABLE membership(
    id SERIAL PRIMARY KEY,
    rank TEXT,
    total_cup INT,
    member_id SERIAL REFERENCES member (id)
);

CREATE TABLE coupon(
    id SERIAL PRIMARY KEY,
    is_used BOOLEAN,
    code TEXT,
    type TEXT,
    member_id SERIAL REFERENCES member (id)
);

CREATE TABLE member_address(
    id SERIAL PRIMARY KEY,
    address TEXT,
    is_main BOOLEAN,
    member_id SERIAL REFERENCES member(id)
);

CREATE TABLE autentication(
    id SERIAL PRIMARY KEY,
    code TEXT,
    member_id SERIAL REFERENCES member (id)
);

CREATE TABLE photo_member(
    id SERIAL PRIMARY KEY,
    img TEXT,
    member_id SERIAL REFERENCES member (id)
);

CREATE TABLE payment(
    id SERIAL PRIMARY KEY,
    type TEXT,
    number TEXT,
    member_id SERIAL REFERENCES member (id)
);

CREATE TABLE review(
    id SERIAL PRIMARY KEY,
    rate NUMERIC(3,2),
    comment TEXT,
    create_at TIMESTAMPTZ,
    member_id SERIAL REFERENCES member (id),
    menu_id SERIAL REFERENCES menu (id)
);

CREATE TABLE employee(
    id SERIAL PRIMARY KEY,
    username VARCHAR(40),
    password VARCHAR(50),
    name TEXT,
    phone_no VARCHAR(10),
    age INT,
    address TEXT,
    status BOOLEAN,
    login_time TIMESTAMPTZ,
    logout_time TIMESTAMPTZ,
    work_history TEXT
);

CREATE TABLE photo_employee(
    id SERIAL PRIMARY KEY,
    img TEXT,
    employee_id SERIAL REFERENCES employee (id)
);