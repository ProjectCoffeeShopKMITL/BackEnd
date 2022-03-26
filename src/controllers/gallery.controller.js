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
        const { newimg } = req.body;
        //get id from param
        let { }
    } catch (err) {
        console.error(err.message);
    }
};

//DELETE method 'gallery/:id'

module.exports = {};
