const Discord = require("discord.js");
const client = new Discord.Client({
  disabledEvents: [
    "TYPING_START"
  ],
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
  ]
});


function formatDate(date, boolean) {
  let day = []
  let monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];

  day.push(date.getDate(), month = date.getMonth(), year = date.getFullYear(), hour = ('0' + date.getHours()).slice(-2), minutes = ('0' + date.getMinutes()).slice(-2))

  day.splice(1)

  return `${day.join('')} ${monthNames[parseInt(month, 10)]} ${year} ${boolean === true ? "à "+hour + ':' + minutes : ""}`;
}


const fs = require('fs');
const path = require("path");
const axios = require('axios');
const perspective = require('/usr/src/bot/perspective.js');
const { DISCORD_TOKEN, GCLOUDAPIKEY, YTCHANNELID, TWITCH_CHANNEL_ID, DISCORD_ID_CHANNEL_ANNONCE, DISCORD_GUILD_ID, DISCORD_ID_CHANNEL_BIENVENUE } = require('/data/config/config.json');



const YOUTUBE_REQUEST = `https://www.googleapis.com/youtube/v3/search?key=${GCLOUDAPIKEY}&channelId=${YTCHANNELID}`;

client.once('ready', () => {
  console.log(formatDate(new Date(), true), 'UTC : Connecté !');
});


client.on('guildMemberAdd', guildMember => {
  guildMember.guild.channels.cache.get(DISCORD_ID_CHANNEL_BIENVENUE).send(`**Veuillez souhaiter la bienvenue à , <@${guildMember.user.id}>!**`);
  setTimeout(() => {
    const message = member.guild.channels.cache.get(DISCORD_ID_CHANNEL_BIENVENUE).lastMessage
    message.react('🎉')
}, 500)
});


const { IsValidToken, UPDATE_AuthToken, GET_streamInfo } = require('./functions/stream.js')

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync("/data/config/db.json");
const db = low(adapter);

db.defaults({ config_twitch: [] }).write()

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
  // or are from a client or commands


  if (!message.guild || message.author.client || message.content.startsWith('/')) return;

  // Evaluate attributes of user's message
  let log;
  try {
    log = await evaluateMessage(message);
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
    const { LASTVIDEODATE } = require('/data/config/youtubedata.json');
    var guild = client.guilds.cache.get('')
    var channel = client.channels.cache.get(DISCORD_ID_CHANNEL_ANNONCE) // ID CHANNEL ANNONCES: 857198075616821258
    const response = await axios.get(`${YOUTUBE_REQUEST}&part=snippet,id&order=date&maxResults=1`);
    const videos = response.data.items;
    const lastVideo = videos[0];
    const Lastvideoname = lastVideo.snippet.title;
    const lastVideoId = lastVideo.id.videoId;
    const lastvideodate = lastVideo.snippet.publishedAt;
    if (lastvideodate !== LASTVIDEODATE) {
      fs.writeFileSync('/data/config/youtubedata.json', JSON.stringify({ LASTVIDEODATE: lastvideodate }));
      channel.send(`**Nouvelle vidéo youtube !** \n ${Lastvideoname} \n https://www.youtube.com/watch?v=${lastVideoId}`)
      console.log(formatDate(new Date(), true), "UTC : Nouvelle vidéo youtube, annonce postée");
    }
  }
   checkYoutube();
   setInterval(checkYoutube, 1200000);

  async function callbackToDiscordChannel_TwitchNotification() {
    const guild = client.guilds.cache.get(DISCORD_GUILD_ID); // ID Fast Theo: 857198075172749332


    const streamInfo = await GET_streamInfo(TWITCH_CHANNEL_ID); //-- ID: fast_theo 640206489 / -Viewer / -Titre / -Game / -> Actualisation tt les 2 min. 
    const local_streamDB = db.get('config_twitch').value()[0];

    if (streamInfo.data.length !== 0) {
      if (local_streamDB.IsOnline === false) {
        db.get('config_twitch').find({ IsOnline: false }).assign({ IsOnline: true }).write();

        if (local_streamDB.IsPublished === true) { return };

        const obj_stream = streamInfo.data[0];
        if (!obj_stream) { return console.error("An error happened (no obj_stream)") };
        const embed = new Discord.MessageEmbed()
          .setAuthor({ name: `${obj_stream.user_name}`})
          .setThumbnail(`https://static-cdn.jtvnw.net/jtv_user_pictures/636cbc67-4818-4c71-afbc-b648a1102f93-profile_image-150x150.png`)
          .setTitle(`${obj_stream.title}`)
          .setURL(`https://www.twitch.tv/${obj_stream.user_name}`)
          .setColor("0x6441a4")
          .setImage((obj_stream.thumbnail_url).replace('{width}x{height}', '640x360'))
          .addField('Viewers',  `${obj_stream.viewer_count}`, true)
          .addField('Jeu', `${obj_stream.game_name}`, true)
          .setFooter({ text: "Alerte twitch", iconURL: client.user.avatarURL() })
          .setTimestamp()
        // ID CHANNEL ANNONCES: 857198075616821258
        guild.channels.cache.get(DISCORD_ID_CHANNEL_ANNONCE).send({
          content: `Salut @everyone ! **${obj_stream.user_name}** est en live ! https://www.twitch.tv/${obj_stream.user_name}`,
          embeds: [embed]
        }, function (a) {
          if (a !== null) {
            throw new Error("An error happened while sending the message (TwitchNofication Start) : " + a)
          }
        })

        db.get('config_twitch').find({ IsPublished: false }).assign({ IsPublished: true }).write();
      } else {
        return;
      }
    } else {
      if (local_streamDB.IsOnline === true) {
        db.get('config_twitch').find({ IsPublished: true }).assign({ IsPublished: false, IsOnline: false }).write()
      }
    }
  }
  callbackToDiscordChannel_TwitchNotification()
  setInterval(callbackToDiscordChannel_TwitchNotification, 2 * 60 * 1000)
})



client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;


  if (commandName === 'help') {
    interaction.reply ({content : "Il suffit de faire un / pour voir toutes les commandes disponibles et leur description.", ephemeral: true});
}

if (commandName === 'lastvideo') {
  const REQUEST_URL = `${YOUTUBE_REQUEST}&part=snippet,id&order=date&maxResults=1`
  axios.get(REQUEST_URL).then(response => {
    const videourl = response.data.items[0].id.videoId;
    interaction.reply({content: `Dernière vidéo de théo => https://www.youtube.com/watch?v=${videourl}`, ephemeral: true});
  });
}

if (commandName === 'réseaux') {
    interaction.reply ({content : "Twitch: https://www.twitch.tv/fast_theo\nYoutube: https://www.youtube.com/channel/UCxqruUoare-3qIPZJFoKL7w\nDiscord: https://discord.gg/AttADVayrU\nTiktok: https://www.tiktok.com/@fast_theo?lang=fr", ephemeral: true});
}

});

client.login(DISCORD_TOKEN);