const pool = require("../db");

//GET 
const homepage = async (req, res) => {
  try {
    res.send("Hello World From HOMEPAGE");
  } catch (err) {
    console.error(err.message);
  }
};
//section1 CRUD
//GET method
const getSection1 = async (req, res) => {
  try {
    const allSection1 = await pool.query(`
        SELECT *
        FROM homepage AS h
        WHERE h.section = 1;
        `);
    res.json(allSection1.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
};
//POST method
const addSection1 = async (req, res) => {
  try {
    //   header: 'text',
    //   detail: 'text',
    //   img: 'file IMG'
    // }
    //get from client
    const { header, detail, img } = req.body;
    //add photo
    const addPhoto = await pool.query(
      `
      INSERT INTO photo_content (img)
      VALUES ($1)
      `,
      [img]
    );
    //add info
    const newSection1 = await pool.query(
      `
        INSERT INTO homepage (section, header, detail, photo_content_id)
        VALUES (1, $1, $2,
            (SELECT p.id
                        FROM photo_content AS p
                       WHERE p.img = $3
            )
        )
        `,
      [header, detail, img]
    );
  } catch (err) {
    console.error(err.message);
  }
};
//DELETE method
const deleteSection1 = async (req, res) => {
    try {
        //get id from parameter
        let { id } = req.params;
        //turn id(type:string) to id(int)
        id = parseInt(id);
        //get id photo
        let idPhoto = await pool.query(`
          SELECT h.photo_content_id::int
          FROM homepage as h
          WHERE h.id = $1
        `, [id]);
        idPhoto = idPhoto.rows[0].photo_content_id;
        //delete info (need to delete info before photo because FK of photo_id)
        const deleteInfo = await pool.query(`
          DELETE FROM homepage as h
          WHERE h.id = $1
        `, [id])
        //delete photo
        const deletePhoto = await pool.query(`
          DELETE FROM photo_content as p
          WHERE p.id = $1
        `, [idPhoto]);
        // console.log("DELETE SUCCESS");
      } catch (err) {
        console.error(err.message);
      }
};


module.exports = {
  homepage,
  getSection1,
  addSection1,
  deleteSection1
};
