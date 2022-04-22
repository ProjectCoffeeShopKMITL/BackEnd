const pool = require("../db");

// (GET) get all orders in database '/orders'
const getAllOrders = async (req, res) => {
  try {

    const getAllOrdersData = await pool.query(
      `
      
      `
      );



  } catch (err) {
    console.error(err.message);
  }
};

// (GET) get a order in database '/orders/:firstname'
const getOrder = async (req, res) => {
  try {
    const { firstname } = req.params;

    const getOrderData = await pool.query(
      `
      SELECT *
      FROM orders AS o
      WHERE o.firstname = $1
      `,
      [firstname]
    );

    const result = [];

    for (const each of getOrderData.rows) {
      const menu_array_result = [];
      for (const menu of each.menu_array) {
        const [menu_id, quantity] = menu;

        const getInfoData = await pool.query(
          `
            SELECT *
            FROM menu AS m
              LEFT JOIN (
                SELECT DISTINCT ON (pm.menu_id) pm.id, pm.img, pm.menu_id
                FROM photo_menu AS pm
                ORDER BY pm.menu_id, pm.id
              ) pm ON pm.menu_id = m.id
            WHERE m.id = $1
          `,
          [menu_id]
        );

        menu_array_result.push({ ...getInfoData.rows[0], quantity:parseInt(quantity) });
      }

      result.push({...each, menu_array:menu_array_result});
    }

    res.send(result);
  } catch (err) {
    console.error(err.message);
  }
};
// (GET) list of menu '/orders/:id'
const getListMenu = async (req, res) => {
  try {
  } catch (err) {
    console.error(err.message);
  }
};

// (POST) add order to database '/order'
const addOrder = async (req, res) => {
  try {
    //get detail order from client when order req.body
    const {
      firstname,
      lastname,
      phone_no,
      address,
      note,
      subtotal,
      discount,
      shipping,
      total,
    } = req.body;

    let { menu_array } = req.body;

    // let menu_array = [
    //   ["7", "2"],
    //   ["16", "3"],
    // ];
    // menu 1, menu 2, ....
    // '{ {"menu_id","quantity"}, {} , ...}'
    // '{ {"1", "2"}, {"2", "1"} }'

    //tranform menu_array for insert into menu_array column
    let text = "{";
    for (let i = 0; i < menu_array.length; i++) {
      text += "{";
      for (let j = 0; j < menu_array[i].length; j++) {
        text += '"';
        text += menu_array[i][j];
        text += '",';
      }
      text = text.slice(0, -1);
      text += "},";
    }
    text = text.slice(0, -1);
    text += "}";

    //add detail except menu_array
    const addOrderData = await pool.query(
      `
          INSERT INTO orders( firstname,
                              lastname,
                              phone_no,
                              address,
                              note,
                              order_timestamptz,
                              menu_array,
                              subtotal,
                              discount,
                              shipping,
                              total)
          VALUES ($1,
                  $2,
                  $3,
                  $4,
                  $5,
                  NOW(),
                  $6,
                  $7,
                  $8,
                  $9,
                  $10)
      `,
      [
        firstname,
        lastname,
        phone_no,
        address,
        note,
        text,
        subtotal,
        discount,
        shipping,
        total,
      ]
    );

    res.send("addOrder complete");
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  getAllOrders,
  getOrder,
  addOrder,
};
