const pool = require("../db");

// (GET) get all employees '/employees'
const getAllEmployees = async (req, res) => {
  try {
    //get all employee from database
    const getAllEmployeesData = await pool.query(
      `
            SELECT  e.firstname,
                    e.lastname,
                    e.age,
                    e.phone_no,
                    e.email, 
                    e.login_time, 
                    e.logout_time,
                    pe.id,
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
    const duplicatedCount = parseInt(countDuplicatedEmailsData.rows[0]);

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
      getEmployeeIdData = parseInt(getEmployeeIdData.rows[0]);

      //add photo_employee to database
      const addPhotoEmployeeData = await pool.query(
        `
                INSERT INTO photo_employee( img, employee_id)
                VALUES ( null, $1)    
            `,
        [getEmployeeIdData]
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
    const { employee_img } = req.body;

    //update image to database
    const updateImgEmployeeData = await pool.query(
      `
            UPDATE photo_employee
            SET img = $1
            WHERE id = $2
        `,
      [employee_img, id]
    );

    res.send("updateEmployee complete");
  } catch (err) {
    console.error(err.message);
  }
};

// (POST) login employee '/employees/:id/login'
const loginEmployee = async (req, res) => {
    try {
        //get employee id from req.params
        const { id } = req.params;

        //get email, password from req.body
        const { email, password} = req.body;



    } catch (err) {
        console.error(err.message);
    }
};

// (POST) logout

module.exports = {
  getAllEmployees,
  addEmployee,
  updateEmployee
};
