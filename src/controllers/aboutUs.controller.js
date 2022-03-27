const pool = require("../db");

//CRUD about_us
// GET .../about_us
const getAll = async (req, res) => {
  try {
    //Get from database
    const allInfo = await pool.query(
      `
            SELECT *
            FROM about_us
            ORDER BY id
            `
    );
    res.json(allInfo.rows);
  } catch (err) {
    console.error(err.message);
  }
};

// PUT .../about_us/:id
const updateInfo = async (req, res) => {
  try {
    //get new info
    const { content } = req.body;
    //get id from client
    let { id } = req.params;
    //parse id to int
    id = parseInt(id);

    //update content
    const updateContent = await pool.query(
      `
            UPDATE about_us
            SET content = $1
            WHERE id = $2
            `,
      [content, id]
    );
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  getAll,
  updateInfo,
};
