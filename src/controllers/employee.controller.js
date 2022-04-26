const pool = require("../db");

// (GET) get all employees '/employees'
const getAllEmployees = async (req, res) => {
  try {
    //get all employee from database
    const getAllEmployeesData = await pool.query(
      `
            SELECT  e.id,
                    e.firstname,
                    e.lastname,
                    e.age,
                    e.phone_no,
                    e.email, 
                    e.login_time, 
                    e.logout_time,
                    pe.id AS photo_employee_id,
                    pe.img 
            FROM employee AS e
                LEFT JOIN (
                        SELECT pe.id, pe.img, pe.employee_id
                        FROM photo_employee AS pe   
                ) pe ON e.id = pe.employee_id
            `
    );

    res.json(getAllEmployeesData.rows);
  } catch (err) {
    console.error(err.message);
  }
};

// (POST) add employee '/employees'
const addEmployee = async (req, res) => {
  try {
    //get info from req.body
    const { email, password, firstname, lastname, phone_no, age } = req.body;

    //check duplicate email
    const countDuplicatedEmailsData = await pool.query(
      `
            SELECT COUNT(e.email)
            FROM employee AS e
            WHERE e.email = $1
        `,
      [email]
    );
    const duplicatedCount = parseInt(countDuplicatedEmailsData.rows[0].count);

    if (duplicatedCount != 0) {
      res.status(400).send("Duplicate Email Please Re-Register");
    } else {
      //add employee to database
      const addEmployeeData = await pool.query(
        `
              INSERT INTO employee( email, password, firstname, lastname, phone_no, age, login_time)
              VALUES ( $1, $2, $3, $4, $5, $6, NOW())    
          `,
        [email, password, firstname, lastname, phone_no, age]
      );

      //get employee_id newest
      let getEmployeeIdData = await pool.query(
        `
              SELECT e.id::int
              FROM employee AS e
              ORDER BY e.id DESC
              LIMIT 1
          `
      );

      //parse to int
      getEmployeeIdData = parseInt(getEmployeeIdData.rows[0].id);

      //get image from req.body
      const { image } = req.body;

      //add photo_employee to database
      const addPhotoEmployeeData = await pool.query(
        `
                INSERT INTO photo_employee( img, employee_id)
                VALUES ( $1, $2)    
            `,
        [image, getEmployeeIdData]
      );

      res.send("addEmployee complete");
    }
  } catch (err) {
    console.error(err.message);
  }
};

// (PUT) update employee '/employees/:id'
const updateEmployee = async (req, res) => {
  try {
    //get employee_id from req.params
    const { id } = req.params;

    //get update info employee from req.body
    const { firstname, lastname, phone_no, age } = req.body;

    //update info to database
    const updateEmployeeData = await pool.query(
      `
            UPDATE employee
            SET firstname = $1,
                lastname = $2,
                phone_no = $3,
                age = $4
            WHERE id = $5
        `,
      [firstname, lastname, phone_no, age, id]
    );

    //get image employee from req.body
    const { image } = req.body;

    //update image to database
    const updateImgEmployeeData = await pool.query(
      `
            UPDATE photo_employee
            SET img = $1
            WHERE employee_id = $2
        `,
      [image, id]
    );

    res.send("updateEmployee complete");
  } catch (err) {
    console.error(err.message);
  }
};

// (POST) login employee '/employees/login/:id'
const loginEmployee = async (req, res) => {
  try {
    //get email, password from req.body
    const { email, password } = req.body;

    const checkPassword = await pool.query(
      `
      SELECT COUNT(email)
      FROM member
      WHERE email = $1
        AND password = $2
      `,
      [email, password]
    );

    if (checkPassword.rows[0].count == 1) {
      //update login_time
      const updateLoginTimeData = await pool.query(
        `
            UPDATE employee
            SET login_time = NOW(), logout_time = null
            WHERE email = $1
        `,
        [email]
      );

      //get info from database
      const getEmployeeData = await pool.query(
        `
            SELECT e.id,
                   e.firstname, 
                   e.lastname, 
                   e.email, 
                   e.phone_no, 
                   e.age, 
                   e.login_time, 
                   e.logout_time, 
                   pe.id AS photo_employee_id,
                   pe.img
            FROM employee AS e
                     LEFT JOIN (
                SELECT pe.employee_id, pe.id, pe.img
                FROM photo_employee = pe
            ) pm ON e.id = pe.employee_id
            WHERE e.email = $1
            `,
        [email]
      );

      res.send(getEmployeeData.rows[0]);
    } else {
      res.status(400).send("Not have this email!");
    }
  } catch (err) {
    console.error(err.message);
  }
};

// (POST) logout '/employees/logout/:id'
const logoutEmployee = async (req, res) => {
  try {
    //get employee_id from req.params
    const { id } = req.params;

    //update logout_time data
    const updateLogoutTimeData = await pool.query(
      `
          UPDATE employee
          SET logout_time = NOW()
          WHERE id = $1
      `,
      [id]
    );

    res.send("logoutEmployee complete");
  } catch (err) {
    console.error(err.message);
  }
};

// (DELETE) delete employee '/employees/delete/:id'
const deleteEmployee = async (req, res) => {
  try {
    //get employee_id from req.params
    const { id } = req.params;

    //delete photo_employee data
    const deletePhotoEmployeeData = await pool.query(
      `
          DELETE
          FROM photo_employee
          WHERE employee_id = $1
      `,
      [id]
    );

    //delete employee data
    const deleteEmployeeData = await pool.query(
      `
          DELETE
          FROM employee
          WHERE id = $1
      `,
      [id]
    );

    res.send("deleteEmployee complete");
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  getAllEmployees,
  addEmployee,
  updateEmployee,
  loginEmployee,
  logoutEmployee,
  deleteEmployee
};
