const pool = require("../db");

//get all members '/management/members'
const getAllMembers = async (req, res) => {
  try {
    //get member from database
    const getAllMemberData = await pool.query(
      `
            SELECT pm.img AS photo, m.firstname, m.lastname, m.phone_no AS mobile, ms.rank, m.register_date
            FROM member AS m
                    LEFT JOIN (
                SELECT pm.member_id, pm.img
                FROM photo_member AS pm
            ) pm ON m.id = pm.member_id
                    LEFT JOIN (
                SELECT ms.member_id, ms.rank
                FROM membership AS ms
            ) ms ON m.id = ms.member_id
            ORDER BY m.id
            `
    );

    //send as JSON
    res.json(getAllMemberData.rows);
  } catch (err) {
    console.error(err.message);
  }
};

//get a member detail '/members/:id'
const getInfoMember = async (req, res) => {
  try {
    //get id member from params
    const { id } = req.params;

    //get info from database
    const getMemberData = await pool.query(
      `
            SELECT m.id, m.firstname, m.lastname, m.email, m.phone_no, m.gender, m.birthdate, pm.img
            FROM member AS m
                     LEFT JOIN (
                SELECT pm.member_id, pm.img
                FROM photo_member AS pm
            ) pm ON m.id = pm.member_id
            WHERE m.id = $1
            `,
      [id]
    );

    //send info as JSON
    res.json(getMemberData.rows);
  } catch (err) {
    console.error(err.message);
  }
};

//(POST)Register member '/register'
const registerMember = async (req, res) => {
  try {
    //get email, password from req.body
    const { firstname, lastname, email, phone_no, password } = req.body;

    //if checkDuplicate.rows[0].count = 0 not dup, = 1 is dup
    const checkDuplicate = await pool.query(
      `
      SELECT COUNT(email)
      FROM member
      WHERE email = $1
      `,
      [email]
    );
    if (checkDuplicate.rows[0].count == 0) {
      //register member to database
      const registerMemberData = await pool.query(
        `
          INSERT INTO member (firstname, lastname, email, phone_no, password)
          VALUES ($1, $2, $3, $4, $5)
      `,
        [firstname, lastname, email, phone_no, password]
      );

      res.json("Register Complete");
    } else {
      res.status(400).send("email is Duplicate");
    }
  } catch (err) {
    console.error(err.message);
  }
};
//(POST)Login member '/login'
const loginMember = async (req, res) => {
  try {
    //get email, password from req.body
    const { email, password } = req.body;

    const checkPassword = await pool.query(
      `
      SELECT COUNT(email)
      FROM member
      WHERE email = $1
        AND password = $2
      `,
      [email, password]
    );

    if (checkPassword.rows[0].count == 1) {
      //get info from database
      const getMemberData = await pool.query(
        `
            SELECT m.id, m.firstname, m.lastname, m.email, m.phone_no, m.gender, m.birthdate, pm.img
            FROM member AS m
                     LEFT JOIN (
                SELECT pm.member_id, pm.img
                FROM photo_member AS pm
            ) pm ON m.id = pm.member_id
            WHERE m.email = $1
            `,
        [email]
      );

      const getAllAddressOneMemberData = await pool.query(
        `
            SELECT *
            FROM member_address AS ma
            WHERE ma.member_id = $1
        `,
        [getMemberData.rows[0].id]
      );

      getMemberData.rows[0].address = getAllAddressOneMemberData.rows;

      res.send(getMemberData.rows);
    } else {
      res.status(400).send("Not have this email!");
    }
  } catch (err) {
    console.error(err.message);
  }
};

//get membership of one member '/members/:id/membership'
const getMembership = async (req, res) => {
  try {
    //get id member from req.params
    const { id } = req.params;

    //get membership info from database
    const getMembershipData = await pool.query(
      `
            SELECT ms.rank
            FROM membership AS ms
            WHERE ms.member_id = $1
            `,
      [id]
    );

    //send membership as JSON
    res.json(getMembershipData.rows);
  } catch (err) {
    console.error(err.message);
  }
};

//get all address of one member '/members/:id/addresses'
const getAllAddresses = async (req, res) => {
  try {
    //get member id from req.params
    const { id } = req.params;

    //get all address from database
    const getAllAddressData = await pool.query(
      `
            SELECT  ma.id,
                    ma.firstname,
                    ma.lastname,
                    ma.phone_no,
                    ma.address,
                    ma.note,
                    ma.is_main
            FROM member_address AS ma
            WHERE ma.member_id = $1
            ORDER BY ma.id
    `,
      [id]
    );

    res.json(getAllAddressData.rows);
  } catch (err) {
    console.error(err.console);
  }
};
//get a address of one member '/members/:id/addresses/:id_address'
const getAddress = async (req, res) => {
  try {
    //get id member and id address
    const { id, id_address } = req.params;

    //get a address from database
    const getAddressData = await pool.query(
      `
            SELECT  ma.id,
                    ma.firstname,
                    ma.lastname,
                    ma.phone_no,
                    ma.address,
                    ma.note
            FROM member_address AS ma
            WHERE ma.member_id = $1
                AND ma.id = $2;
            `,
      [id, id_address]
    );

    //send as json object
    res.json(getAddressData.rows);
  } catch (err) {
    console.error(err.message);
  }
};
//edit and update (PUT) '/members/:id/addresses/:id_address'
const updateAddress = async (req, res) => {
  try {
    //get id member and id address from req.params
    const { id, id_address } = req.params;

    //get new value to update address database from req.body
    const { address, is_main, firstname, lastname, phone_no, note } = req.body;

    //update data to database
    const updateAddressData = await pool.query(
      `
            UPDATE member_address
            SET address   = $1,
                is_main   = $2,
                firstname = $3,
                lastname  = $4,
                phone_no  = $5,
                note      = $6 
            WHERE id = $7
                AND member_id = $8
        `,
      [address, is_main, firstname, lastname, phone_no, note, id, id_address]
    );

    //log complete
    res.json("updateAddress");
  } catch (err) {
    console.error(err.message);
  }
};
//delete '/members/:id/addresses/:id_address'
const deleteAddress = async (req, res) => {
  try {
    //get id member and id address
    const { id, id_address } = req.params;

    //delete address from database
    const deleteAddressData = await pool.query(
      `
            DELETE
            FROM member_address
            WHERE member_id = $1
                AND id = $2;
        `,
      [id, id_address]
    );
    //log delete complete
    res.json("deleteAddress complete");
  } catch (err) {
    console.error(err.message);
  }
};
//add a address '/members/:id/addresses'
const addAddress = async (req, res) => {
  try {
    //get id member from req.params
    const { id } = req.params;
    //get info address from req.body
    const { address, firstname, lastname, phone_no, note } = req.body;

    //add address to database
    const addAddressData = await pool.query(
      `
            INSERT INTO member_address (address, is_main, member_id, firstname, lastname, phone_no, note)
            VALUES ( $1, false, $2, $3, $4, $5, $6)
        `,
      [address, id, firstname, lastname, phone_no, note]
    );

    //log add complete
    console.log("ADD new address complete");
  } catch (err) {
    console.error(err.message);
  }
};

//get coupon of one member '/members/:id/coupons'
const getAllCoupons = async (req, res) => {
  try {
  } catch (err) {
    console.error(err.message);
  }
};

//get all bill of one member '/members/:id/bills' NOT have bill table
// const getAllbills = async (req, res) => {
//     try {
//         //get id member from req.params
//         const { id } = req.params;

//         //get all bills from database
//         const getBillsData = await pool.query(``);

//     } catch (err) {
//         console.error(err.message);
//     }
// };

module.exports = {
  getAllMembers,
  getInfoMember,
  registerMember,
  loginMember,
  getMembership,

  getAllAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
  addAddress,

  getAllCoupons,
};
