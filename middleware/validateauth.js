const Joi = require("@hapi/joi");

const registerSchema = Joi.object({
	name: Joi.string().min(6).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
});
const loginSchema = {
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
};

module.exports = async (req, res, next) => {
	const { email, name, password } = req.body;
	if (req.path === "/register") {
		try {
			const { error } = await registerSchema.validate(req.body);
			if (error) {
				return res.status(401).send(error.details[0].message);
			}
			next();
		} catch (error) {
			console.log(error.message);
			return res.status(500).json("server error");
		}
	}
	if (req.path === "/login") {
		try {
			const { error } = await loginSchema.validate(req.body);
			if (error) {
				return res.status(401).send(error.details[0].message);
			}
			next();
		} catch (error) {
			console.log(error.message);
			return res.status(500).json("server error");
		}
	}
};
