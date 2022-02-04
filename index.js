require("dotenv/config");

const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//Route

//Menu Route
//Create menu method
// app.post("/addMenu", async (req, res) => {
//   try {
//     const { menu_name, menu_price, amount_menu } = req.body;
//     const newMenu = await pool.query(
//       "INSERT INTO menu (menu_name, menu_price, amount_menu) VALUES($1,$2,$3) RETURNING *",
//       [menu_name, menu_price, amount_menu]
//     );
//     res.json(newMenu.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

//get all menu method
// app.get("/menus", async (req, res) => {
//   try {
//     const allMenus = await pool.query("SELECT * FROM menu");
//     res.json(allMenus.rows);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

//get a menu method
// app.get("/menus/:menu_name", async (req, res) => {
//   try {
//     const { menu_name } = req.params;
//     const menu = await pool.query("SELECT * FROM menu WHERE menu_name = $1", [
//       menu_name,
//     ]);
//     res.json(menu.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// update a menu method
//delete a menu method

app.listen(process.env.API_PORT, () => {
  console.log("Server has started on PORT 5001");
});
