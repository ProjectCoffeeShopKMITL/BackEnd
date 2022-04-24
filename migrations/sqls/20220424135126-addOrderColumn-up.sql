/* Replace with your SQL commands */

ALTER TABLE orders
ADD COLUMN member_id SERIAL,
ADD FOREIGN KEY (member_id) REFERENCES member(id) ;
