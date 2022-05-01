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

// (GET) get a order in database '/orders/member/:id'
const getOrderForMember = async (req, res) => {
  try {
    const { id } = req.params;

    const getOrderData = await pool.query(
      `
      SELECT o.id, firstname, lastname, phone_no, address, note,
              order_timestamptz, menu_array, subtotal, discount,
              shipping, total, os.id AS status_id, status, o.member_id
      FROM orders AS o
        LEFT JOIN (
          SELECT os.id, os.order_id, os.status::int
          FROM orders_status AS os
        ) os ON o.id = os.order_id
      WHERE o.member_id = $1
      `,
      [id]
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

// (GET) get a order in database '/orders/guest/:firstname/:lastname'
const getOrderForGuest = async (req, res) => {
  try {
    const { firstname, lastname } = req.params;

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
          AND o.lastname = $2
      `,
      [firstname, lastname]
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
        const [menu_id, quantity, note] = menu;

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
          note: note,
        });
      }

      const orderStatus = await pool.query(
        `
          SELECT *
          FROM orders_status AS os
          WHERE os.order_id = $1
        `,
        [req.params.id]
      );

      result.push({
        ...each,
        menu_array: menu_array_result,
        status: orderStatus.rows[0].status,
      });
    }
    res.send(result);
  } catch (err) {
    console.error(err.message);
  }
};

// (POST) order '/order'
const addOrder = async (req, res) => {
  try {
    let { menu_array } = req.body;

    //object list quantity used [ [stocks_id , used_quantity], ... ]
    let used_quantity_object = [];
    // canAddOrder = boolean for check can order
    let canAddOrder = true;

    for (const eachMenu of menu_array) {
      let menu_id = parseInt(eachMenu[0]);
      let menu_order_quantity = parseInt(eachMenu[1]);

      //get recipe_quantity
      const eachMenuRecipeData = await pool.query(
        `
            SELECT ms.id, 
                  ms.menu_id, 
                  ms.stock_id, 
                  ms.quantity AS recipe_quantity
            FROM menu_stocks AS ms
            WHERE menu_id = $1
            ORDER BY ms.id
        `,
        [menu_id]
      );
      //each is a record that tell about stock_id, recipe_quantity
      for (const each of eachMenuRecipeData.rows) {
        //calculate count of used_quantity of one ingredient
        let all_used_quantity = parseFloat(each.recipe_quantity);
        all_used_quantity *= menu_order_quantity;
        // console.log( each.stock_id, typeof(each.stock_id) ,' ', all_used_quantity, typeof(each.stock_id));

        if (used_quantity_object.length === 0) {
          used_quantity_object.push([each.stock_id, all_used_quantity]);
        } else {
          let isDuplicated = false;
          for (const eachIngredient of used_quantity_object) {
            if (each.stock_id == eachIngredient[0]) {
              isDuplicated = true;
              eachIngredient[1] += all_used_quantity;
              break;
            } else {
              isDuplicated = false;
            }
          }

          if (isDuplicated) {
            // console.log("Is dup");
          } else {
            used_quantity_object.push([each.stock_id, all_used_quantity]);
          }
          // console.log(used_quantity_object);
        }
      }
    }
    //after have list of used_quantity_object next is check if quantity in stock is more than or equal
    //eachStock[0] is stock_id, eachStock[1] is quantity that need for add order
    for (const eachStock of used_quantity_object) {
      let isNotEnough = false;
      const getAStockData = await pool.query(
        `
          SELECT s.quantity::float
          FROM stocks AS s
          WHERE s.id = $1
        `,
        [eachStock[0]]
      );
      // use getAStockData.rows[0].quantity is a stock_quantity, type = number
      if (getAStockData.rows[0].quantity < eachStock[1]) {
        isNotEnough = true;
      } else {
        isNotEnough = false;
      }

      if (isNotEnough) {
        canAddOrder = false;
        break;
      } else {
        continue;
      }
    }

    if (canAddOrder) {
      //delete ingredient in stock use used_quantity_object
      //eachIngredient[0] is stock_id, eachIngredient[1] is quantity that need for add order
      for (const eachIngredient of used_quantity_object) {
        //update stock quantity from database
        const updateStockData = await pool.query(
          `
              UPDATE stocks
              SET quantity = quantity - $1
              WHERE id = $2
          `,
          [eachIngredient[1], eachIngredient[0]]
        );
      }

      //get detail order from client when order req.body
      const {
        member_id,
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

      // result_used = [ ["2", "x"], ["3", "y"] ]

      // let menu_array = [
      //   ["7", "2", "note"],
      //   ["16", "3", "note"],
      // ];
      // menu 1, menu 2, ....
      // '{ {"menu_id","quantity", "note"}, {} , ...}'
      // '{ {"1", "2", "note"}, {"2", "1", "note"} }'

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
                              total,
                              member_id)
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
                  $10,
                  $11)
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
          member_id,
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
    } else {
      res.status(400).send("Cannot Add Order Because out of stocks");
    }
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

//(PUT) update status order '/orders/:id/status/:status_now'
const updateStatusOrder = async (req, res) => {
  try {
    const { id, status_now } = req.params;

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
  getOrderForGuest,
  getOrderForMember,
  getListMenu,
  updateOrder,
  deleteOrder,
  updateStatusOrder,

  addOrder,
};
