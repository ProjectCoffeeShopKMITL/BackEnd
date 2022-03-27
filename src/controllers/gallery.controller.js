const pool = require("../db");

//CRUD gallery

//GET method '/gallery'
// {
//     "id"
//     "img"
// }
const getGallery = async (req, res) => {
  try {
    const getAll = await pool.query(
      `
            SELECT *
            FROM gallery
            ORDER BY id
        `
    );
    res.json(getAll.rows);
  } catch (err) {
    console.error(err.message);
  }
};
//POST method '/gallery'
const addImage = async (req, res) => {
  try {
    //get img from client
    const { img } = req.body;
    //add picture
    const newPicture = await pool.query(
      `
            INSERT INTO gallery (img)
            VALUES ($1)
            `,
      [img]
    );
  } catch (err) {
    console.error(err.message);
  }
};
//PUT method 'gallery/:id'
const updateImg = async (req, res) => {
  try {
    //get new to update image
    const { img } = req.body;
    //get id from param
    let { id } = req.params;
    //parse to int
    id = parseInt(id);

    //update image
    const updateImage = await pool.query(
      `
        UPDATE gallery
        SET img = $1
        WHERE id = $2
        `,
      [img, id]
    );
  } catch (err) {
    console.error(err.message);
  }
};

//DELETE method 'gallery/:id'
const deleteImg = async (req, res) => {
  try {
    //get id from req.params
    let { id } = req.params;
    //parse id to int
    id = parseInt(id);

    //delete photo in database
    const deleteImg = await pool.query(
      `
        DELETE
        FROM gallery
        WHERE id = $1  
        `,
        [id]
    );
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  getGallery,
  addImage,
  updateImg,
  deleteImg
};
