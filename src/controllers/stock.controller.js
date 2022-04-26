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
        [eachStock.ingredient_name, each.quantity, each.unit]
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

//(POST) add quantity of ingredient stock
const addQuantityStocks = async (req, res) => {
  try {
    //get addStocks = [{stocks_id, quantity} , ...]
    const { addStocks } = req.body;

    //loop eachData of addStocks
    for (const eachAdd of addStocks) {
      //update stocks
      const updateStocksData = await pool.query(
        `
                UPDATE stocks
                SET quantity = (SELECT quantity
                                FROM stocks
                                WHERE id = 1) + $1
                WHERE id = $2
            `,
        [eachAdd.quantity, eachAdd.stocks_id]
      );

      //add new stocks_transactions
      const addStockTransactionData = await pool.query(
        `
                INSERT INTO ( stocks_id, quantity, timeaddstock)
                VALUES ( $1, $2, NOW() )
          `,
        [eachAdd.stocks_id, eachAdd.quantity]
      );
    }
  } catch (err) {
    console.error(err.message);
  }
};

//(POST) calculate stock
const calculateStocks = async (req, res) => {
  try {
    //get used of stock list
    // usedStocks = [ {stocks_id, quantity} , ... ]
    const { usedStocks } = req.body;

    //loop for calculate stock
    for (const eachData of usedStocks) {
      //update stock in database
      const updateStocks = await pool.query(
        `
                    UPDATE stocks 
                    SET quantity = (SELECT 
                                    FROM stocks
                                    WHERE id = $1            
                        ) - $2 
                    WHERE id = $3 
            `,
        [eachData.stocks_id, eachData.quantity, eachData.stocks_id]
      );
    }

    res.send("calculateStocks complete");
  } catch (err) {
    console.error(err.message);
  }
};

//(GET) get recipe(all need ingredient) of a menu
//(POST)

module.exports = {
  getAllStocks,
  addNewStock,
  addQuantityStocks,
  calculateStocks,
};
