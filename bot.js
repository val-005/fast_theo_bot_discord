const { Client, Intents, GuildMember } = require('discord.js');
const fs = require('fs');
const path = require("path");
const axios = require('axios');
const perspective = require('./perspective.js');
const { DISCORD_TOKEN, GCLOUDAPIKEY, YTCHANNELID } = require('./config.json');


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.DIRECT_MESSAGES] });


const YOUTUBE_REQUEST = `https://www.googleapis.com/youtube/v3/search?key=${GCLOUDAPIKEY}&channelId=${YTCHANNELID}`;

client.once('ready', () => {
	console.log('Ready!');
});


// Perspective API
/**
 * Analyzes a user's message for attribues
 * and reacts to it.
 * @param {string} message - message the user sent
 * @return {bool} shouldKick - whether or not we should
 * kick the users
 */
async function evaluateMessage(message) {
  let scores;
  try {
    scores = await perspective.analyzeText(message.content);
  } catch (err) {
    console.log(err);
    return false;
  }

  const userid = message.author.id;


    if (scores['SEVERE_TOXICITY']) {
      return true;
    }
}

client.on('messageCreate', async (message) => {
  // Ignore messages that aren't from a guild
  // or are from a bot or commands
if (!message.guild || message.author.bot || message.content.startsWith('/')) return;

  // Evaluate attributes of user's message
  let log = false;
  try {
  //  log = await evaluateMessage(message);
  } catch (err) {
    console.log(err);
  }
  if (log) {
    await message.delete();
    //var logchannel = client.channels.cache.get('921712224416968747')
    //var perspectivelog = new Discord.MessageEmbed()
    //.setColor(color.rouge)
    //.setAuthor("Log Perspective Api :", client.user.avatarURL)
    //.setDescription("<@"+ userid +"> a envoyé un message considéré comme toxique, \n voici le contenu de celui ci : \n "+ "`"+ message.content + "` \n \n Aucune sanction contre cet utilisateur ne sera prise automatiquement.")
    //.setTimestamp()
   // logchannel.send(perspectivelog)
    // var dm = new Discord.MessageEmbed()
    //.setColor(color.rouge)
    //.setAuthor("Avertissement :", client.user.avatarURL)
    //.setDescription("Bonjour, \n un de vos messages récents à été supprimé car il a été considéré comme toxique. \n Voici le contenu de celui ci : \n "+ "`"+ message.content + "` \n \n Nous voulons faire de ce discord un lieu d'échange cordial ,dans la bonne humeur. Les insultes ou tout autres messages à caractère dénigrant n'ont pas leur place ici. Selon la gravité de votre message, des sanctions pourront être prises par les modérateurs. \n Merci de votre compréhension.  \n \n NB : Si vous pensez que cette alerte est une erreur, veuillez contacter un modérateur.")
    //.setTimestamp()
    // message.member.createDM().then(c => c.send(dm))

    return false;
  }
});


// Partie fonctions
client.on('ready', async message => {
    // fonction pour vérifier la sortie d'une nouvelle vidéo youtube
        const checkYoutube = async () => {
            const {LASTVIDEOID} = require('./youtubedata.json');
            var guild = client.guilds.cache.get('')
            var channel = client.channels.cache.get('921712224416968747')
            const response = await axios.get(`${YOUTUBE_REQUEST}&part=snippet,id&order=date&maxResults=1`);
            const videos = response.data.items;
            const lastVideo = videos[0];
            const Lastvideoname = lastVideo.snippet.title;
            const lastVideoId = lastVideo.id.videoId;
            if (lastVideoId !== LASTVIDEOID) {
                console.log('ok');
                fs.writeFileSync('./youtubedata.json', JSON.stringify({LASTVIDEOID: lastVideoId}));
                channel.send(`@everyone **Nouvelle vidéo youtube !** \n ${Lastvideoname} \n https://www.youtube.com/watch?v=${lastVideoId}`);
        }
    }
    // checkYoutube();
    // setInterval(checkYoutube, 1200000);
    })

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;


    if (commandName === 'help') {

    }

	if (commandName === 'lastvideo') {
        const REQUEST_URL = `${YOUTUBE_REQUEST}&part=snippet,id&order=date&maxResults=1`
        axios.get(REQUEST_URL).then(response => {
        const videourl = response.data.items[0].id.videoId;
		interaction.reply(`Dernière vidéo de théo => https://www.youtube.com/watch?v=${videourl}`);
        });
    }
	
});

client.login(DISCORD_TOKEN);