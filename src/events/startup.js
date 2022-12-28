const Event = require("../classes/Event");
const getStats = require("../functions/getStats");
const Discord = require("discord.js");

module.exports = new Event("ready", () => {
	async function setUptime() {
		const botStats = await getStats();
		const hour = new Date().getHours();
		const min = new Date().getMinutes();

		if (botStats.uptime.last !== hour) {
			botStats.uptime[hour] = 1;
			botStats.uptime.lastHour = hour;
		} else if (botStats.uptime.lastMin !== min) {
			botStats.uptime[hour]++;
			botStats.uptime.lastMin = min;
		}

		await stats.set("uptime", botStats.uptime);
	}

	setUptime();
	setInterval(setUptime, 6e4);

	client.user.setActivity({
		name: "cats",
		type: Discord.ActivityType.Streaming,
		url: "https://www.youtube.com/watch?v=_yqSbnbUsj4&t=5s",
	});
});
