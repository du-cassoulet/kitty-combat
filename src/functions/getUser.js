const User = require("../classes/User");
const Discord = require("discord.js");

/**
 * @param {Discord.User} user
 * @returns {User}
 */
async function getUser(user) {
	const userData = User.form(await users.get(user.id));
	const userAvatar = user.displayAvatarURL({
		extension: "png",
		size: 512,
	});

	if (userData && userData.tag !== user.tag) {
		await users.set(`${user.id}.tag`, user.tag);
	}

	if (userData && userData.avatarURL !== userAvatar) {
		await users.set(`${user.id}.avatarURL`, userAvatar);
	}

	return userData;
}

module.exports = getUser;
