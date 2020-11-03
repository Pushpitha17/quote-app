const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); //req.body

//routes

//register and login

app.use("/admin", require("./routes/jwtauth"));
app.use("/", require("./routes/quote"));

app.listen(PORT, () => {
	console.log(`server is listening on port ${PORT}`);
});
