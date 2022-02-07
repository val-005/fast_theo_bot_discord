const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./deploy-config.json');

// Espace commandes
const commands = [
	new SlashCommandBuilder().setName('help').setDescription('Affiche les commandes disponible'),
	new SlashCommandBuilder().setName('lastvideo').setDescription('Affiche la dernière vidéo de la chaîne youtube'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);