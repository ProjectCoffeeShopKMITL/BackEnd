const pool = require("../db");

// CRUD

//(GET) get all stocks list '/stocks'
const getAllStocks = async (req, res) => {
  try {
    //get all record of stocks table
    const getAllStocksData = await pool.query(
      `
                    SELECT s.id, s.ingredient_name, s.quantity, s.unit
                    FROM stocks AS s
                    ORDER BY s.id
            `
    );

    res.json(getAllStocksData.rows);
  } catch (err) {
    console.error(err.message);
  }
};

//(POST) add stock {ingredient_name, quantity, unit} '/stocks'
const addNewStock = async (req, res) => {
  try {
    //get stocks = [{ingredient_name, quantity, unit}, ...]
    const { stocks } = req.body;
    //add new stock to stocks table
    for (const eachStock of stocks) {
      //add new stock
      const addStockData = await pool.query(
        `
                INSERT INTO stocks ( ingredient_name, quantity, unit)
                VALUES ( $1, $2, $3)
        `,
        [eachStock.ingredient_name, eachStock.quantity, eachStock.unit]
      );
      //get latese id to add stocks_transaction
      let getStockId = await pool.query(
        `
                SELECT id::int
                FROM stocks
                ORDER BY id DESC
                LIMIT 1
          `
      );
      getStockId = parseInt(getStockId.rows[0].id);

      const addStockTransactionData = await pool.query(
        `
                INSERT INTO stocks_transaction ( stocks_id, quantity, timeaddstock)
                VALUES ( $1, $2, NOW())
          `,
        [getStockId, eachStock.quantity]
      );
    }

    res.send("addStock complete");
  } catch (err) {
    console.error(err.message);
  }
};

//(PUT) update ingredient_name, quantity(add only), unit of ingredient stock '/stocks/update/:id'
const updateStocks = async (req, res) => {
  try {
    //get stock_id from req.params
    const { id } = req.params;

    //get { ingredient_name, quantity, unit }
    const { ingredient_name, quantity, unit } = req.body;

    //update stocks
    const updateStocksData = await pool.query(
      `
                UPDATE stocks
                SET ingredient_name = $1,
                    quantity = $2,
                    unit = $3 
                WHERE id = $4
            `,
      [ingredient_name, quantity, unit, id]
    );

    res.send("updateStocks complete");
  } catch (err) {
    console.error(err.message);
  }
};

//(DELETE) delete a stock '/stocks/delete/:id'
const deleteStock = async (req, res) => {
  try {
    //get stock_id from req.params
    const { id } = req.params;

    //delete from menu_stocks
    const deleteMenu_stocksData = await pool.query(
      `
          DELETE
          FROM menu_stocks
          WHERE stock_id = $1;
      `,
      [id]
    );

    //delete from stocks
    const deleteStocks = await pool.query(
      `
          DELETE
          FROM stocks
          WHERE id = $1;
      `,
      [id]
    );

    res.send("deleteStock complete");
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  getAllStocks,
  addNewStock,
  updateStocks,
  calculateStocks,
  deleteStock
};
