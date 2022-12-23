const User = require("../classes/User");

async function getUser(id) {
	return User.form(await users.get(id));
}

module.exports = getUser;
