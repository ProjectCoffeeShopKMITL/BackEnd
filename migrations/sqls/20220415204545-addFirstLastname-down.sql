/* Replace with your SQL commands */

ALTER TABLE member
ADD name TEXT;

ALTER TABLE member
DROP COLUMN firstname;

ALTER TABLE member
DROP COLUMN lastname;

ALTER TABLE member_address
DROP COLUMN firstname;

ALTER TABLE member_address
DROP COLUMN lastname;