const Event = require("../classes/Event");
const Discord = require("discord.js");

module.exports = new Event("voiceStateUpdate", async (oldVoice, newVoice) => {
	const oldVoiceIndex = client.voiceChannels.findIndex(
		(v) => v.userId === oldVoice.member.id
	);

	if (
		!oldVoice.channelId &&
		newVoice.channelId === process.env.CREATE_CHANNEL_ID
	) {
		const channel = await newVoice.guild.channels.create({
			name: `${newVoice.member.user.username}'s channel`,
			parent: newVoice.channel.parentId,
			type: Discord.ChannelType.GuildVoice,
		});

		await newVoice.setChannel(channel);
		client.voiceChannels.push({
			channel: channel,
			userId: newVoice.member.id,
		});
	} else if (
		client.voiceChannels.find((v) => v.channel.id === newVoice.channelId)
	) {
		client.voiceChannels.push({
			channel: newVoice.channel,
			userId: newVoice.member.id,
		});
	} else if (oldVoiceIndex + 1) {
		const channel = client.voiceChannels[oldVoiceIndex].channel;
		client.voiceChannels.splice(oldVoiceIndex, 1);

		if (
			!client.voiceChannels.find((v) => v.channel.id === oldVoice.channelId)
		) {
			if (channel.deletable) channel.delete();
		}
	}
});
