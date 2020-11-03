const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtgenerator");
const validate = require("../middleware/validateauth");
const authorize = require("../middleware/authorize");

//regitser

router.post("/register", validate, async (req, res) => {
	try {
		//destructure req.body (name , email , password)

		const { name, email, password } = req.body;
		//check if user exists
		const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
			email,
		]);
		if (user.rows.length !== 0) {
			return res.status(401).send("user exists");
		}

		//bcrypt user password
		const saltRound = 10;
		const salt = await bcrypt.genSalt(saltRound);

		const bcryptpassword = await bcrypt.hash(password, salt);

		//enter new user
		const newUser = await pool.query(
			"INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3)",
			[name, email, bcryptpassword]
		);
		const token = jwtGenerator(newUser.rows[0].user_id);

		res.json({ token });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("server error");
	}
});

//login route

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
			email,
		]);

		if (user.rows.length === 0) {
			return res.status(401).json("User with that email does not exists");
		}

		const validpasswod = await bcrypt.compare(
			password,
			user.rows[0].user_password
		);

		if (!validpasswod) {
			return res.status(401).json("Password is incorrect");
		}

		const token = jwtGenerator(user.rows[0].user_id, user.rows[0].user_name);
		res.json({ token });
	} catch (error) {
		console.log(error.message);
	}
});

router.post("/addquote", authorize, async (req, res) => {
	try {
		const {
			body: { quote, author, notes },
			user: { id },
		} = req;

		const newTodo = await pool.query(
			"INSERT INTO quotes (user_id, quote, author , notes) VALUES ($1, $2, $3 ,$4)",
			[id, quote, author, notes]
		);

		res.json(newTodo);
	} catch (error) {
		console.log(error);
	}
});

router.get("/islogged", authorize, (req, res) => {
	res.json(req.user);
});

router.get("/allquotes", authorize, async (req, res) => {
	try {
		const quotes = await pool.query(
			"SELECT * FROM quotes ORDER BY quote_id DESC"
		);
		res.json(quotes.rows);
	} catch (error) {
		console.error(err.message);
		res.status(500).send("server error");
	}
});

module.exports = router;
