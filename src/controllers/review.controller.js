const pool = require("../db");

// (GET) get all reviews
const getAllReviews = async (req, res) => {
    try {
        //get all review in database
        const getReviewsData = await pool.query(
            `

            `);
    } catch (err) {
        console.error(err.message);
    }
};
// (POST) ADD review
// 

module.exports = {
    
};