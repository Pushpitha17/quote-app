const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authorize");

router.get("/quote", async (req, res) => {
	try {
		const todo = await pool.query(
			// "SELECT * FROM quotes OFFSET FLOOR(RANDOM() * (SELECTCOUNT(*)FROM quotes)) LIMIT 1;"
			"SELECT * FROM quotes ORDER BY RANDOM() LIMIT 1;"
		);
		res.json(todo.rows[0]);
	} catch (error) {}
});

module.exports = router;
