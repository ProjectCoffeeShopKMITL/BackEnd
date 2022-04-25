/* Replace with your SQL commands */

ALTER TABLE stocks
ADD unit TEXT;

ALTER TABLE employee
DROP COLUMN username;

ALTER TABLE employee
DROP COLUMN name;

ALTER TABLE employee
DROP COLUMN address;

ALTER TABLE employee
DROP COLUMN status;

ALTER TABLE employee
DROP COLUMN work_history;

ALTER TABLE employee
ADD email TEXT;

ALTER TABLE employee
ADD firstname TEXT;

ALTER TABLE employee
ADD lastname TEXT;