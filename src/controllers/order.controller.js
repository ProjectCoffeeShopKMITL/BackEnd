const pool = require("../db");

// (GET) get all orders in database '/orders'
const getAllOrders = async (req, res) => {
  try {
    const getAllOrdersData = await pool.query(
      `
      SELECT  o.id , firstname, lastname, phone_no, address, note,
      order_timestamptz, menu_array, subtotal, discount,
      shipping, total, os.id AS status_id, status
      FROM orders AS o
        LEFT JOIN (
          SELECT os.id, os.order_id, os.status::int
          FROM orders_status AS os
        ) os ON o.id = os.order_id
      `
    );

    const result = [];

    for (const each of getAllOrdersData.rows) {
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
        menu_array_result.push({
          ...getInfoData.rows[0],
          quantity: parseInt(quantity),
        });
      }
      result.push({ ...each, menu_array: menu_array_result });
    }

    res.send(result);
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
      SELECT o.id, firstname, lastname, phone_no, address, note,
              order_timestamptz, menu_array, subtotal, discount,
              shipping, total, os.id AS status_id, status
      FROM orders AS o
        LEFT JOIN (
          SELECT os.id, os.order_id, os.status::int
          FROM orders_status AS os
        ) os ON o.id = os.order_id
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
        menu_array_result.push({
          ...getInfoData.rows[0],
          quantity: parseInt(quantity),
        });
      }
      result.push({ ...each, menu_array: menu_array_result });
    }

    res.send(result);
  } catch (err) {
    console.error(err.message);
  }
};
// (GET) list of menu '/order/:id'
const getListMenu = async (req, res) => {
  try {
    const getAllOrdersData = await pool.query(
      `
      SELECT *
      FROM orders AS o
      WHERE o.id = $1
      `,
      [req.params.id]
    );

    const result = [];

    for (const each of getAllOrdersData.rows) {
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
        menu_array_result.push({
          ...getInfoData.rows[0],
          quantity: parseInt(quantity),
        });
      }
      result.push({ ...each, menu_array: menu_array_result });
    }
    res.send(result);
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

    //add detail
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
          RETURNING id
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

    //get newest id from database table(menu)
    let getIDnewest = await pool.query(
      `
            SELECT id::int
            FROM orders
            ORDER BY id DESC
            LIMIT 1
      `
    );
    //parse object(getIDnewest) to int for use menu.id to store image
    getIDnewest = parseInt(getIDnewest.rows[0].id);

    const addOrderStatusData = await pool.query(
      `
      INSERT INTO orders_status (order_id, status)
      VALUES ($1, 1)
      `,
      [getIDnewest]
    );

    res.send({ id: addOrderData.rows[0].id });
  } catch (err) {
    console.error(err.message);
  }
};

// (PUT) update order '/orders/:id'
const updateOrder = async (req, res) => {
  try {
    //get order id to update that order_id
    const { id } = req.params;

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

    //update data to order (with order_id)
    const updateOrderData = await pool.query(
      `
          UPDATE orders
          SET firstname = $1,
              lastname = $2,
              phone_no = $3,
              address = $4,
              note = $5,
              order_timestamptz = NOW(),
              menu_array = $6,
              subtotal = $7,
              discount = $8,
              shipping = $9,
              total = $10
          WHERE id = $11;
      `,
      [
        firstname,
        lastname,
        phone_no,
        address,
        note,
        menu_array,
        subtotal,
        discount,
        shipping,
        total,
        id,
      ]
    );

    res.send("updateOrder complete");
  } catch (err) {
    console.error(err.message);
  }
};

// (DELETE) delete unwanted order '/orders/:id'
const deleteOrder = async (req, res) => {
  try {
    //get order id to delete
    const { id } = req.params;

    const deleteOrderData = await pool.query(
      `
          DELETE
          FROM orders
          WHERE id = $1;
      `,
      [id]
    );
    res.send("deleteOrder Complete");
  } catch (err) {
    console.error(err.message);
  }
};

//update status order '/orders/:id/status'
const updateStatusOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_now } = req.body;

    const updateStatusData = await pool.query(
      `
      UPDATE orders_status
      SET status = $1
      WHERE order_id = $2
      `,
      [status_now, id]
    );

    res.send("UpdateStatusOrder ID: " + id);
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  getAllOrders,
  getOrder,
  addOrder,
  getListMenu,
  updateOrder,
  deleteOrder,

  updateStatusOrder,
};
