require("dotenv/config");

const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//Route
//get all menu to display
app.get("/menus", async (req, res) => {
  try {
    //name, price, sale_to, img ---> only one picture
    const allMenus = await pool.query(
      "SELECT menu.menu_name, menu.price, menu.sale_to, photo_menu.img FROM menu LEFT JOIN photo_menu ON menu.menu_id = photo_menu.menu_id WHERE photo_menu.photo_menu_description = 'main'"
    );
    //response json 
    res.json(allMenus.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a menu detail
app.get("/menus/:menu_name", async (req, res) => {
  try {
    //get menu_name as parameter for query a menu detail
    const { menu_name } = req.params;
    
    //get primary key from menu table can use with menu_id.rows[0].menu_id
    const menu_id = await pool.query("SELECT menu_id FROM menu WHERE menu_name = $1", [menu_name]);
    
    //query Images of menu 
    const imgAll = await pool.query("SELECT photo_menu_id,img FROM photo_menu WHERE menu_id = $1 ORDER BY photo_menu_id ", [menu_id.rows[0].menu_id]);
   
    //result query : 3 table menu, photo, review
    const menuDetail = await pool.query("SELECT menu_name, price, menu_description, sale_to, is_recommend, menu_type, time_add, photo_menu_id, img FROM menu INNER JOIN photo_menu ON photo_menu.menu_id = menu.menu_id WHERE menu.menu_id = $1 ORDER BY photo_menu.photo_menu_id", [menu_id.rows[0].menu_id]);
    //send response to frontend
    res.json(menuDetail.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// create a menu

app.listen(process.env.API_PORT, () => {
  console.log("Server has started on PORT 5001");
});
