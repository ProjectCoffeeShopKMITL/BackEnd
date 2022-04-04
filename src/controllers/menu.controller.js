const pool = require("../db");

//all menu '/menu'
//name, is_recommend, type, rate, price, image
const getAllMenu = async (req, res) => {
  try {
    const getAll = await pool.query(
      `
        SELECT m.name, m.is_recommend, m.type, pm.img, rate::float
        FROM menu AS m
            LEFT JOIN (
                    SELECT DISTINCT ON (pm.menu_id) pm.menu_id, pm.img
                    FROM photo_menu AS pm
                    ORDER BY pm.menu_id, pm.id
        ) pm ON m.id = pm.menu_id
            LEFT JOIN (
                    SELECT AVG(r.rate) as rate, r.menu_id
                    FROM review AS r
                    GROUP BY r.menu_id
        ) r ON m.id = r.menu_id;
        `
    );
    res.json(getAll.rows);
  } catch (err) {
    console.error(err.message);
  }
};

// one menu has
// name, rate, COUNT(review), price, sale_to
// ,description, all menu review, recommend menu limit 4
//GET method '/menu/:name'
//get a detail of one menu 
const getDetailMenu = async (req, res) => {
  try {
    //get name from req.params
    const { name } = req.params;

    //get id,menu_name,
    const getDetail = await pool.query(
      `
        SELECT m.id, m.name AS menu_name, m.price::float , m.sale_to::float , m.description
        FROM menu AS m
        WHERE m.name = $1
        `,
      [name]
    );
    res.json(getDetail.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
};
//POST method '/menu'
//id, name, price, description, sale_to, is_recommend, type, create_at
const addMenu = async (req, res) => {
  try {
    //get from client(req.body)
    const { name, price, description, sale_to, is_recommend, type, create_at } =
      req.body;
    //insert record to database table(menu)
    const addInfoMenu = await pool.query(
      `
        INSERT INTO menu (name, price, description, sale_to, is_recommend, type, create_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
      [name, price, description, sale_to, is_recommend, type, create_at]
    );
    //get newest id from database table(menu)
    let getIDnewest = await pool.query(
      `
        SELECT id::int
        FROM menu
        ORDER BY id DESC
        LIMIT 1
        `
    );
    //parse object(getIDnewest) to int for use menu.id to store image
    getIDnewest = getIDnewest.rows[0].id;

    //get object image from req.body.image
    // image["image1","image2","image3","image4"]

    //this is test
    const image = ["image1", "image2", "image3", "image4"];

    //for loop to store all image that client send to back
    for (let i = 0; i < image.length; i++) {
      const storeEachImage = await pool.query(
        `
            INSERT INTO photo_menu (img, menu_id)
            VALUES ($1, $2)
            `,
        [image[i], getIDnewest]
      );
    }
  } catch (err) {
    console.error(err.message);
  }
};

//PUT method
//update detail menu
// name, 


//Delete method

module.exports = {
  getAllMenu,
  getDetailMenu,
  addMenu,
};
