const pool = require("../db");

//    !!!GET all homepage NOT FINISH!!!
const homepage = async (req, res) => {
  try {
    res.send("Hello World From HOMEPAGE");
  } catch (err) {
    console.error(err.message);
  }
};
//section1 CRUD
//GET method '/homepage/section/1'
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
//POST method '/homepage/section/1'
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
//PUT method '/homepage/section/1/:id'
const updateSection1 = async (req, res) => {
  try {
    //get req.body
    const { header, detail, img } = req.body;
    //get id from param
    let { id } = req.params;
    //parse(id) to int
    id = parseInt(id);

    //get id_photo_content
    let idPhoto = await pool.query(
      `
      SELECT h.photo_content_id
      FROM homepage AS h
      WHERE h.id = $1
    `,
      [id]
    );
    //and parse(id_photo_content Type:JSON) to int
    idPhoto = idPhoto.rows[0].photo_content_id;

    //update photo
    const updatePhoto = await pool.query(
      `
      UPDATE photo_content
      SET img = $1
      WHERE id = $2
    `,
      [img, idPhoto]
    );

    //update detail
    const updateDetail = await pool.query(
      `
      UPDATE homepage
      SET section = 1,
          header = $1,
          detail = $2
      WHERE id = $3
    `,
      [header, detail, id]
    );
  } catch (err) {
    console.error(err.message);
  }
};
//DELETE method '/homepage/section/1/:id'
const deleteSection1 = async (req, res) => {
  try {
    //get id from parameter
    let { id } = req.params;
    //turn id(type:string) to id(int)
    id = parseInt(id);
    //get id photo
    let idPhoto = await pool.query(
      `
          SELECT h.photo_content_id::int
          FROM homepage as h
          WHERE h.id = $1
        `,
      [id]
    );
    idPhoto = idPhoto.rows[0].photo_content_id;
    //delete info (need to delete info before photo because FK of photo_id)
    const deleteInfo = await pool.query(
      `
          DELETE FROM homepage as h
          WHERE h.id = $1
        `,
      [id]
    );
    //delete photo
    const deletePhoto = await pool.query(
      `
          DELETE FROM photo_content as p
          WHERE p.id = $1
        `,
      [idPhoto]
    );
    // console.log("DELETE SUCCESS");
  } catch (err) {
    console.error(err.message);
  }
};

//section2 CRUD 
//GET method '/homepage/section/2' max = 4
const getSection2 = async (req, res) => {
  try {
    const allSection2 = await pool.query(`
      SELECT *
      FROM homepage AS h
      WHERE h.section = 2;
    `);
    res.json(allSection2.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
};
//POST method '/homepage/section/2'
const addSection2 = async (req, res) => {
  try {
    // {
    //   id: x
    //   section: 2
    //   header: 'title ing.'
    //   detail: 'detail ing.'
    // }
    //get from client
    const { header, detail } = req.body;
    //add photo_file = 'null'
    const addPhotoNull = await pool.query(`
      INSERT INTO photo_content (img)
      VALUES ('null');
    `);
    //add ingredient
    const newSection2 = await pool.query(
      `
      INSERT INTO homepage (section, header, detail, photo_content_id)
      VALUES (2, $1, $2,
              ( SELECT p.id
                FROM photo_content AS p
                WHERE p.img = 'null'
              ))
      `,
      [header, detail]
    );
  } catch (err) {
    console.error(err.message);
  }
};
//PUT method 'homepage/section/2/:id'
const updateSection2 = async (req,res) => {
  try {
    //get req.body
    const { header, detail } = req.body;
    

  } catch (err) {
    console.error(err.message);
  }

};

module.exports = {
  homepage,
  getSection1,
  addSection1,
  updateSection1,
  deleteSection1,

  //update section1
  //CRUD section2
  //CRUD section3
  //CRUD section4
};
