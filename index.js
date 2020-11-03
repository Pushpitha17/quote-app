const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); //req.body

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "quote-app-frontend/build")));
}
//routes

//register and login

app.use("/admin", require("./routes/jwtauth"));
app.use("/", require("./routes/quote"));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "quote-app-frontend/build/index.html"));
});

app.listen(PORT, () => {
	console.log(`server is listening on port ${PORT}`);
});
