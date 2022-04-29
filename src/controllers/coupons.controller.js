const pool = require("../db");

// (GET) get all coupons of member '/members/:id/coupons'
const getAllCoupons = async (req, res) => {
  try {
    //get id member from req.params
    const { id } = req.params;

    //get all coupons of member_id
    const getAllCouponsData = await pool.query(
      `
            SELECT c.id, c.code, c.type
            FROM coupon AS c
            WHERE c.member_id = $1
                  AND c.is_used = true
            `,
      [id]
    );
    res.send(getAllCouponsData.rows);
  } catch (err) {
    console.error(err.message);
  }
};

// (POST) create new coupons
const sendCoupon = async (req, res) => {
  try {


  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  getAllCoupons,
};
