/* Replace with your SQL commands */

ALTER TABLE member
DROP COLUMN name;

ALTER TABLE member
ADD firstname TEXT;

ALTER TABLE member
ADD lastname TEXT;

ALTER TABLE member_address
ADD firstname TEXT;

ALTER TABLE member_address
ADD lastname TEXT;