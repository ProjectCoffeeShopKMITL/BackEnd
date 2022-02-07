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
    const allMenus = await pool.query("SELECT menu.menu_name, menu.price, menu.sale_to, photo_menu.img FROM menu LEFT JOIN photo_menu ON menu.menu_id = photo_menu.menu_id WHERE photo_menu.photo_menu_description = 'main'");
    res.json(allMenus.rows);
  } catch (err) {
    console.error(err.message);
  }
});
//get a menu detail

// create a menu


app.listen(process.env.API_PORT, () => {
  console.log("Server has started on PORT 5001");
});
