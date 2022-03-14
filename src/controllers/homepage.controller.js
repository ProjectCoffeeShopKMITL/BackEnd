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
// {
//   "id"
//   "section"
//   "header"
//   "detail"
//   "file_img"
// }
const getSection1 = async (req, res) => {
  try {
    const allSection1 = await pool.query(
      `
      SELECT h.id, h.section, h.header, h.detail, p.img AS file_img
      FROM homepage AS h
              LEFT JOIN photo_content AS p
                        ON h.id = p.homepage_id
      WHERE h.section = 1
      ORDER BY h.id;
      `
    );
    res.json(allSection1.rows);
  } catch (err) {
    console.error(err.message);
  }
};
//POST method '/homepage/section/1'
const addSection1 = async (req, res) => {
  try {
    //get from client
    const { header, detail, img } = req.body;
    //add info
    const newSection1 = await pool.query(
      `
      INSERT INTO homepage (section, header, detail)
      VALUES (1, $1, $2)
      `,
      [header, detail]
    );
    //add photo
    const addPhoto = await pool.query(
      `
      INSERT INTO photo_content (img, homepage_id)
      VALUES ( $1,
              (SELECT id
               FROM homepage
               ORDER BY id DESC
               LIMIT 1
              ));
      `,
      [img]
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

    //update detail
    const updateDetail = await pool.query(
      `
      UPDATE homepage
      SET header = $1,
          detail = $2
      WHERE id = $3;
      `,
      [header, detail, id]
    );

    //update photo
    const updatePhoto = await pool.query(
      `
      UPDATE photo_content AS p
      SET img = $1
      WHERE p.homepage_id = $2;
     `,
      [img, id]
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

    //delete photo
    const deletePhoto = await pool.query(
      `
      DELETE 
      FROM photo_content AS p
      WHERE p.homepage_id = $1
      `,
      [id]
    );

    //delete info (need to delete info before photo because FK of photo_id)
    const deleteInfo = await pool.query(
      `
      DELETE 
      FROM homepage
      WHERE id = $1;
      `,
      [id]
    );

    // console.log("DELETE SUCCESS");
  } catch (err) {
    console.error(err.message);
  }
};

//section2 CRUD
//GET method '/homepage/section/2' max = 4
// {
//   "id"
//   "name"
//   "detail"
// }
const getSection2 = async (req, res) => {
  try {
    const allSection2 = await pool.query(
      `
      SELECT h.id, h.header AS name, h.detail
      FROM homepage AS h
      WHERE h.section = 2
      ORDER BY h.id
      `
    );
    res.json(allSection2.rows);
  } catch (err) {
    console.error(err.message);
  }
};
//POST method '/homepage/section/2'
const addSection2 = async (req, res) => {
  try {
    //get from client
    const { header, detail } = req.body;

    //add ingredient
    const addSection2 = await pool.query(
      `
      INSERT INTO homepage (section, header, detail)
      VALUES (2, $1, $2)
      `,
      [header, detail]
    );
  } catch (err) {
    console.error(err.message);
  }
};
//PUT method 'homepage/section/2/:id'
const updateSection2 = async (req, res) => {
  try {
    //get req.body
    const { header, detail } = req.body;
    //get id from req.param
    let { id } = req.params;
    //parse(id) to int
    id = parseInt(id);

    //update header, detail
    const updateDetail = await pool.query(
      `
      UPDATE homepage
      SET header = $1,
          detail = $2
      WHERE id = $3;
    `,
      [header, detail, id]
    );
  } catch (err) {
    console.error(err.message);
  }
};
//DELETE method '/homepage/section/2/:id'
const deleteSection2 = async (req, res) => {
  try {
    //get id
    let { id } = req.params;
    //parse(id) to int
    id = parseInt(id);

    //delete info
    const deleteInfo = await pool.query(
      `
      DELETE 
      FROM homepage
      WHERE id = $1
      `,
      [id]
    );
  } catch (err) {
    console.error(err.message);
  }
};

//section3 CRUD
//GET method '/homepage/section/3'
// {
//   "product name"
//   "file_img"
// }
const getSection3 = async (req, res) => {
  try {
    const allSection3 = await pool.query(
      `
      SELECT h.header AS product_name, p.img AS file_img
      FROM homepage AS h
               LEFT JOIN photo_content AS p
                         ON h.id = p.homepage_id
      WHERE h.section = 3
      ORDER BY h.id;
      `
    );
    res.json(allSection3.rows);
  } catch (err) {
    console.error(err.message);
  }
};
//POST method '/homepage/section/3'
const addSection3 = async (req, res) => {
  try {
    //get from client
    const { header, img } = req.body;

    //add product name(header)
    const addHeader = await pool.query(
      `
      INSERT INTO homepage (section, header, detail)
      VALUES (3, $1, null);
      `,
      [header]
    );
    //add photo of product
    const addPhoto = await pool.query(
      `
      INSERT INTO photo_content (img, homepage_id)
      VALUES ( $1,
              (
                  SELECT id
                  FROM homepage
                  ORDER BY id DESC
                  LIMIT 1
              )
      )
      `,
      [img]
    );
  } catch (err) {
    console.error(err.message);
  }
};
//PUT method '/homepage/section/3/:id'
const updateSection3 = async (req, res) => {
  try {
    //get id
    const { id } = req.params;
    //parse id to int
    id = parseInt(id);

    //get req.body
    const { header, img } = req.body;

    //update product name
    const updateName = await pool.query(
      `
      UPDATE homepage
      SET header = $1
      WHERE id = $2
      `,
      [header, id]
    );

    //update photo
    const updatePhoto = await pool.query(
      `
      UPDATE photo_content
      SET img = $1
      WHERE homepage_id = $2;
      `,
      [img, id]
    );
  } catch (err) {
    console.error(err.message);
  }
};
//DELETE method '/homepage/section/3/:id'
const deleteSection3 = async (req, res) => {
  try {
    //get id from req.params
    const { id } = req.params;
    //id parse to int
    id = parseInt(id);

    //delete photo first
    const deletePhoto = await pool.query(
      `
      DELETE
      FROM photo_content
      WHERE homepage_id = $1;
      `,
      [id]
    );

    //delete product name
    const deleteProductName = await pool.query(
      `
      DELETE
      FROM homepage
      WHERE id = $1;
      `,
      [id]
    );
  } catch (err) {
    console.error(err.message);
  }
};

//section4 CRUD
//GET method '/homepage/section/4'
// {
//   "caption"
// }
const getSection4 = async (req, res) => {
  try {
    //get section4
    const getSection4 = await pool.query(
      `
      SELECT id,detail AS caption
      FROM homepage
      WHERE section = 4
      ORDER BY id;
      `
    );

    res.json(getSection4.rows);
  } catch (err) {
    console.error(err.message);
  }
};
//POST method '/homepage/section/4'
const addSection4 = async (req, res) => {
  try {
    //get detail (caption) from req.body
    const { detail } = req.body;

    //add detail (caption)
    const addCaption = await pool.query(
      `
      INSERT INTO homepage (section, header, detail)
      VALUES (4, null, $1)
      `,
      [detail]
    );
  } catch (err) {
    console.error(err.message);
  }
};
//PUT method '/homepage/section/4/:id'
const updateSection4 = async (req, res) => {
  try {
    //get id from req.params
    const { id } = req.params;
    //parse id to int
    id = parseInt(id);
    //get detail(caption) from req.body
    const { detail } = req.body;

    //update caption
    const updateSection4 = await pool.query(
      `
      UPDATE homepage
      SET detail = $1
      WHERE id = $2
      `,
      [detail, id]
    );
  } catch (err) {
    console.error(err.message);
  }
};
//DELETE method '/homepage/section/4/:id'
const deleteSection4 = async (req, res) => {
  try {
    //get id from req.param
    const { id } = req.params;
    //parse id to int
    id = parseInt(id);

    //delete caption
    const deleteCaption = await pool.query(
      `
      DELETE
      FROM homepage
      WHERE id = $1;
      `,
      [id]
    );
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
  getSection2,
  addSection2,
  updateSection2,
  deleteSection2,
  getSection3,
  addSection3,
  updateSection3,
  deleteSection3,
  getSection4,
  addSection4,
  updateSection4,
  deleteSection4,
};
