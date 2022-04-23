const pool = require("../db");

//all menu '/menus'
//name, is_recommend, type, rate, price, image
const getAllMenu = async (req, res) => {
  try {
    const getAll = await pool.query(
      `
      SELECT  m.name,
              m.id,
              m.price,
              m.sale_to,
              m.is_recommend,
              m.type, 
              m.create_at,
              pm.img,
              rate::float
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
      ) r ON m.id = r.menu_id
      `
    );

    //   {
    //     "menu_id": 17,
    //     "ingredient_name": "expresso(shot)",
    //     "use_quantity": 2
    //    }
    //   {
    //     "menu_id": 17,
    //     "ingredient_name": "expresso(shot)",
    //     "use_quantity": 2
    //    }

    //get all recipe from database
    const getAllRecipesData = await pool.query(
      `
          SELECT ms.menu_id, s.ingredient_name, ms.quantity::float AS use_quantity, s.id AS stock_id
          FROM menu_stocks AS ms
              LEFT JOIN (
                SELECT s.id, s.ingredient_name, s.quantity
                FROM stocks AS s
              ) s ON s.id = ms.stock_id
      `
    );

    getAll.rows.forEach((data) => {
      data.ingredients = [];
    });

    for (const each of getAllRecipesData.rows) {
      for (const eachData of getAll.rows) {
        if (each.menu_id != eachData.id) {
          continue;
        }

        eachData.ingredients.push(each);
      }
    }
    res.send(getAll.rows);

    // res.json(getAll.rows);
  } catch (err) {
    console.error(err.message);
  }
};

//get a detail of one menu '/menus/:name'
const getDetailMenu = async (req, res) => {
  try {
    //get name from req.params
    const { name } = req.params;

    //get id,menu_name,
    const getDetail = await pool.query(
      `
      SELECT  m.id,
              m.name,
              m.price::float,
              m.description,
              m.sale_to::float,
              m.is_recommend,
              m.type,
              p.id,
              p.img
      FROM menu AS m
              LEFT JOIN (
          SELECT p.img, p.menu_id, p.id
          FROM photo_menu AS p
          ORDER BY p.id
      ) p ON m.id = p.menu_id
      WHERE m.name = $1
      `,
      [name]
    );

    res.json(getDetail.rows);
  } catch (err) {
    console.error(err.message);
  }
};

//get recommend menu '/menus/recommend'
const getRecommendMenu = async (req, res) => {
  try {
    //get recommend menu limit 4 menu order by Random
    const randRecommendMenu = await pool.query(
      `
      SELECT  m.name,
              pm.img,
              rate::float,
              m.price::float,
              m.sale_to::float
      FROM menu AS m
               LEFT JOIN (
          SELECT pm.menu_id, pm.id, pm.img
          FROM photo_menu AS pm
          ORDER BY pm.id
          LIMIT 1
      ) pm ON m.id = pm.menu_id
               LEFT JOIN (
          SELECT AVG(rate) AS rate, r.menu_id
          FROM review AS r
          GROUP BY r.menu_id
      ) r ON m.id = r.menu_id
      WHERE m.is_recommend = true
      ORDER BY RANDOM()
      LIMIT 4
      `
    );
    //send as json obj
    res.json(randRecommendMenu.rows);
  } catch (err) {
    console.error(err.message);
  }
};

//POST method add new menu and new image menu(test object image) '/menus'
const addMenu = async (req, res) => {
  try {
    //get from client(req.body)
    const { name, price, description, sale_to, is_recommend, type } = req.body;

    //insert record to database table(menu)
    const addInfoMenu = await pool.query(
      `
        INSERT INTO menu (name, price, description, sale_to, is_recommend, type, create_at)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        `,
      [name, price, description, sale_to, is_recommend, type]
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
    // const image = ["image1", "image2", "image3", "image4"];

    const { image } = req.body;
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

    // ingredients = [ {stock_id, quantity}, {} , ...]
    // add to menu_stock
    const { ingredients } = req.body;

    //loop insert into 'menu_stocks'
    for (const each of ingredients) {
      //add to database
      const deleteMenu_stocks = await pool.query(
        `
            INSERT INTO menu_stocks (menu_id, stock_id, quantity)
            VALUES ($1, $2, $3)
        `,
        [getIDnewest, each.stock_id, each.quantity]
      );
    }

    res.json("addMenu complete");
  } catch (err) {
    console.error(err.message);
  }
};

//PUT method update menu and image menu(test object image) 'menus/:id'
const updateMenu = async (req, res) => {
  try {
    //get menu id from client (req.params)
    const { id } = req.params;

    //get new update from client (req.body)
    const { name, price, description, sale_to, is_recommend, type } = req.body;

    //update detail in datebase
    const updateData = await pool.query(
      `
      UPDATE menu
      SET name         = $1,
          price        = $2,
          description  = $3,
          sale_to      = $4,
          is_recommend = $5,
          type         = $6
      WHERE id = $7
      `,
      [name, price, description, sale_to, is_recommend, type, id]
    );

    // test object image
    //   const image = [{
    //     "id": 5,
    //     "img": "new image1"
    //   },
    //   {
    //     "id": 6,
    //     "img": "new image2"
    //   },
    //   {
    //     "id": 7,
    //     "img": "new image3"
    //   },
    //   {
    //     "id": 8,
    //     "img": "new image4"
    //   }
    // ]
    const { image } = req.body;

    //loop for update image
    for (let i = 0; i < image.length; i++) {
      const updateImgData = await pool.query(
        `
      UPDATE photo_menu
      SET img = $1
      WHERE id = $2
      `,
        [image[i].img, image[i].id]
      );
    }

    // ingredients = [ { stock_id, quantity}, {} , ...]
    // add to menu_stock
    const { ingredients } = req.body;

    //delete old menu_stock record database
    const deleteMenu_stocks = await pool.query(
      `
          DELETE FROM menu_stocks 
          WHERE menu_id = $1
      `,
      [id]
    );

    //loop insert into menu_stocks database
    for (const eachData of ingredients) {
      const addMenu_stock = await pool.query(
        `
            INSERT INTO menu_stocks ( menu_id, stock_id, quantity)
            VALUES ( $1, $2, $3)
        `,
        [id, eachData.stock_id, eachData.quantity]
      );
    }

    res.json("updateMenu complete");
  } catch (err) {
    console.error(err.message);
  }
};

//Delete method 'menus/:id'
const deleteMenu = async (req, res) => {
  try {
    //get id menu from params
    const { id } = req.params;

    //delete photo menu from database
    const deletePhotoMenuData = await pool.query(
      `
        DELETE
        FROM photo_menu AS pm
        WHERE pm.menu_id = $1
      `,
      [id]
    );
    //delete review menu from database
    const deleteReviewData = await pool.query(
      `
        DELETE
        FROM review AS r
        WHERE r.menu_id = $1
      `,
      [id]
    );
    //delete menu from database
    const deleteMenuData = await pool.query(
      `
      DELETE
      FROM menu AS m
      WHERE m.id = $1
      `,
      [id]
    );
    res.json("deleteMenu complete");
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  getAllMenu,
  getDetailMenu,
  getRecommendMenu,
  addMenu,
  updateMenu,
  deleteMenu,
};
