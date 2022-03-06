require("dotenv/config");

const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { query } = require("express");

//middleware
app.use(cors());
app.use(express.json());

//const test value, menus = object (type)
let menus = {
  1: {
    id: 1,
    name: "Latte",
    price: 40.0,
    description: "lorem ipsum dolor sit amte",
    sale_to: 40.0,
    is_recommend: true,
    type: "Coffee",
    create_at: "2021-07-31T23:59:59.123456+10:00",
  },
  2: {
    id: 2,
    name: "Capuchino",
    price: 50.0,
    description: "lorem ipsum dolor sit amte",
    sale_to: 45.0,
    is_recommend: true,
    type: "Coffee",
    create_at: "2021-07-31T23:59:59.123456+10:00",
  },
};

//Route
//get all menu
app.get("/menus", async (req, res) => {
  try {
    return res.send(Object.values(menus));
  } catch (err) {
    console.error(err.message);
  }
});

//get a menu
app.get("/menus/:menu_name", async (req, res) => {
  try {
    console.log(req.params);
    const objectLen = Object.keys(menus).length;
    // console.log(objectLen);
    for (let i = 0; i < objectLen; i++) {
      if (menus[i].name == req.params) {
        return res.send(menus[i]);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
});

//post a menu
app.post("/menus", async (req, res) => {
  try {
    return res.send("Recieved a POST HTTP method");
  } catch (err) {
    console.error(err.message);
  }
});

//update a menu
app.put("/menus/:menu_id", async (req, res) => {
  try {
    return res.send(`
    PUT HTTP method on menu/${req.params.menu_id} resource
    `);
  } catch (err) {
    console.error(err.message);
  }
});

//delete a menu
app.delete("/menus/:menu_id", async (req, res) => {
  try {
    return res.send(`
    DELETE HTTP method on menu/${req.params.menu_id} resource
    `);
  } catch (err) {
    console.error(err.message);
  }
});

//route homepage

let queryHome = {
  1: {
    id: 1,
    section: 1,
    header: "header text",
    detail: "detail text",
    img: "file img",
  },
  2: {
    id: 2,
    section: 1,
    header: "header text2",
    detail: "detail text2",
    img: "file img2",
  },
  3: {
    id: 3,
    section: 1,
    header: "header text3",
    detail: "detail text3",
    img: "file img3",
  },
};

//get homepage "/homepage"
app.get("/homepage", async (req, res) => {
  try {
    return res.send(Object.values(queryHome));
  } catch (err) {
    console.error(err.message);
  }
});

//CRUD section 1 "/homepage/section/1"
//get section1
app.get("/homepage/section/1", async (req, res) => {
  try {
    //get all info but not done (need to join photo first)
    const allSection1 = await pool.query(`
    SELECT *
    FROM homepage AS h
    WHERE h.section = 1;
    `)
    res.json(allSection1.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
//add section 1 
app.post("/homepage/section/1", async (req, res) => {
  try {
    // {
    //   header: 'text',
    //   detail: 'text',
    //   img: 'file IMG'
    // }

    //get from client
    const { header, detail, img } = req.body;
    //add photo
    const addPhoto = await pool.query(`
      INSERT INTO photo_content (img)
      VALUES ($1)
    `, [img]);
    //add info
    const newSection1 = await pool.query(`
      INSERT INTO homepage (section, header, detail, photo_content_id)
      VALUES (1, $1, $2,
              (SELECT p.id
                FROM photo_content AS p
               WHERE p.img = $3
              )
      )
    `,[header, detail, img]);
  
  } catch (err) {
    console.log(err.message)
  }
});
//update section1
//delete section1
app.delete("/homepage/section/1/:id", async (req, res) => {
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

});
 

//get all menu to display
// app.get("/menus", async (req, res) => {
//   try {
//     //name, price, sale_to, img ---> only one picture
//     const allMenus = await pool.query(`
//     SELECT m.menu_name, m.price::float, m.sale_to::float, pm.img, r.star::float, m.menu_type
//     FROM menu m
//              LEFT JOIN (
//         SELECT DISTINCT ON (pm.menu_id) pm.menu_id, pm.img
//         FROM photo_menu pm
//         ORDER BY pm.menu_id, pm.photo_menu_id
//     ) pm ON m.menu_id = pm.menu_id
//              LEFT JOIN (
//         SELECT avg(r.star) as star, r.menu_id
//         FROM review r
//         GROUP BY r.menu_id
//     ) r ON m.menu_id = r.menu_id
//     `);

//     [
//       {
//         menu_name: "Latte",
//         price: 50.0,
//         sale_to: 45.0,
//         img: "img1xzczxcdas",
//       },
//       {
//         menu_name: "Americano",
//         price: 45.0,
//         sale_to: 45.0,
//         img: "img1xzczxcdas",
//       },
//     ];

//     //response json
//     res.json(allMenus.rows);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

//get a menu detail
// app.get("/menus/:menu_name", async (req, res) => {
//   try {
//     //get menu_name as parameter for query a menu detail
//     // const { filter_by, sort_by } = req.query; // get query to sort
//     const { menu_name } = req.params;

//     //get primary key from menu table can use with menu_id.rows[0].menu_id
//     const menu_id = await pool.query(
//       "SELECT menu_id FROM menu WHERE menu_name = $1",
//       [menu_name]
//     );

//     //query Images of menu
//     const imgAll = await pool.query(
//       "SELECT photo_menu_id,img FROM photo_menu WHERE menu_id = $1 ORDER BY photo_menu_id ",
//       [menu_id.rows[0].menu_id]
//     );

//     //result query : 3 table menu, photo, review
//     const menuDetail = await pool.query(
//       "SELECT menu_name, price, menu_description, sale_to, is_recommend, menu_type, time_add, photo_menu_id, img FROM menu INNER JOIN photo_menu ON photo_menu.menu_id = menu.menu_id WHERE menu.menu_id = $1 ORDER BY photo_menu.photo_menu_id",
//       [menu_id.rows[0].menu_id]
//     );
//     //send response to frontend
//     res.json(menuDetail.rows);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// create a menu

//listen on port 5001
app.listen(process.env.API_PORT, () => {
  console.log("Server has started on PORT 5001");
});
