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


var color = {
  bleuC: '008FFF',
  violet: '9E00FF',
  marron: 'FF7400',
  violetrose: 'FF3DF9',
  vert: '23FF00',
  rouge: 'FF3333',
  jaune: 'F3FF00',
  jauneF: 'DCFF00'
 };


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


client.once('ready', () => {
  console.log(formatDate(new Date(), true), 'UTC : Connecté !');
});


client.on('guildMemberAdd', guildMember => {
  guildMember.guild.channels.cache.get(config.DISCORD_ID_CHANNEL_BIENVENUE).send(`**Veuillez souhaiter la bienvenue à <@${guildMember.user.id}> !**`);
  setTimeout(() => {
    const message = client.channels.cache.get(config.DISCORD_ID_CHANNEL_BIENVENUE).lastMessage
    message.react('🎉')
}, 1000)
});


const { IsValidToken, UPDATE_AuthToken, GET_streamInfo } = require('./functions/stream.js')

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync("/data/config/db.json");
const db = low(adapter);

db.defaults({ config_twitch: [] }).write()
db.defaults({ notifs_ytb: [] }).write()

var config = db.get('config').find().value();

const YOUTUBE_REQUEST = `https://www.googleapis.com/youtube/v3/search?key=${config.GCLOUDAPIKEY}&channelId=${config.YTCHANNELID}`;



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
    var ytb_db = db.get('notifs_ytb').find().value();
    var guild = client.guilds.cache.get('')
    var channel = client.channels.cache.get(config.DISCORD_ID_CHANNEL_ANNONCE) // ID CHANNEL ANNONCES: 857198075616821258
    const response = await axios.get(`${YOUTUBE_REQUEST}&part=snippet,id&order=date&maxResults=1`).catch(err => console.log(err));
    const videos = response.data.items;
    const lastVideo = videos[0];
    const Lastvideoname = lastVideo.snippet.title;
    const lastVideoId = lastVideo.id.videoId;
    const lastvideodate = lastVideo.snippet.publishedAt;
    if (lastvideodate !== ytb_db.lastvideo_date) {
      db.get('notifs_ytb').find({ lastvideo_date: ytb_db.lastvideo_date }).assign({ lastvideo_date: lastvideodate }).write();
      channel.send(`**Nouvelle vidéo youtube !** \n${Lastvideoname} \nhttps://www.youtube.com/watch?v=${lastVideoId}`)
      console.log(formatDate(new Date(), true), "UTC : Nouvelle vidéo youtube, annonce postée");
    }
  }
   checkYoutube();
   setInterval(checkYoutube, 1200000);

   const checkstatus = async () => {
    // authenticate with cloudflare access token
    const auth = {
      headers: {
        'CF-Access-Client-Id': config.CLOUDFLARE_ID,
        'CF-Access-Client-Secret': config.CLOUDFLARE_KEY
      }
    };
    // get request status with cloudflare access token
    await axios.get(config.CHECK_STATUS_REQUEST_LINK, auth);
  }
  if(config.CHECK_STATUS === true) {
   checkstatus();
   setInterval(checkstatus, config.CHECK_STATUS_INTERVAL_MIN * 60 * 1000);
  }

  async function callbackToDiscordChannel_TwitchNotification() {
    const guild = client.guilds.cache.get(config.DISCORD_GUILD_ID); // ID Fast Theo: 857198075172749332


    const streamInfo = await GET_streamInfo(config.TWITCH_CHANNEL_ID); //-- ID: fast_theo 640206489 / -Viewer / -Titre / -Game / -> Actualisation tt les 2 min.
        if (streamInfo.error) {
          console.log(formatDate(new Date(), true), "UTC : Erreur lors de la récupération des informations Twitch");
          return;
        }

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
        guild.channels.cache.get(config.DISCORD_ID_CHANNEL_ANNONCE).send({
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

if (commandName === "clear") {
  const permissions = interaction.channel.permissionsFor(interaction.member)
  var nopermissions = new Discord.MessageEmbed()
    .setColor(color.rouge)
    .setTitle("Erreur")
    .setDescription("Vous n'avez pas les permissions nécessaires pour utiliser cette commande.")
  
  if(!permissions.has("MANAGE_MESSAGES")) return interaction.reply({embeds: [nopermissions], ephemeral: true});
  
   
  const { channel, options } = interaction;
  const nombre = options.getNumber("nombre");
  if(nombre > 100) {
    interaction.reply({content: "Vous ne pouvez pas supprimer plus de 100 messages.", ephemeral: true});
  } else {
    const cible = options.getUser("cible");
  const Messages = await channel.messages.fetch();
  
  if(cible) {
  let i = 0;
  const filtered = [];
  (await Messages).filter((m) => {
    if(m.author.id === cible.id && nombre > i) {
      filtered.push(m);
      i++;
    }
  })
  await channel.bulkDelete(filtered, true).then(messages => {
  
    var embed_cible_1 = new Discord.MessageEmbed()
    .setColor(color.vert)
    .setTitle("Succès")
    .setDescription(`1 message de ${cible} a été supprimé.`)
  
    var embed_cible_multi = new Discord.MessageEmbed()
    .setColor(color.vert)
    .setTitle("Succès")
    .setDescription(`${messages.size} messages de ${cible} ont été supprimés.`)
  
  
    if(messages.size === 1) {
    interaction.reply({embeds: [embed_cible_1], ephemeral: true});
    } else {
    interaction.reply({embeds: [embed_cible_multi], ephemeral: true});
    }
  })
  } else {
    await channel.bulkDelete(nombre, true).then(messages => {
      var embed_tous_1 = new Discord.MessageEmbed()
      .setColor(color.vert)
      .setTitle("Succès")
      .setDescription(`1 message a été supprimé.`)
      var embed_tous_multi = new Discord.MessageEmbed()
      .setColor(color.vert)
      .setTitle("Succès")
      .setDescription(`${messages.size} messages ont été supprimés.`)
      if(messages.size === 1) {
        interaction.reply({embeds: [embed_tous_1], ephemeral: true});
        } else {
        interaction.reply({embeds: [embed_tous_multi], ephemeral: true});
        }
    });
  }
 } 
}

if (commandName === 'lastvideo') {
  const REQUEST_URL = `${YOUTUBE_REQUEST}&part=snippet,id&order=date&maxResults=1`
  axios.get(REQUEST_URL).then(response => {
    const videourl = response.data.items[0].id.videoId;
    interaction.reply({content: `Dernière vidéo de théo => https://www.youtube.com/watch?v=${videourl}`, ephemeral: true});
  });
}

if (commandName === 'réseaux') {
  let branchMenu = new Discord.MessageActionRow()
  .addComponents([
    new Discord.MessageSelectMenu()
    .setCustomId('réseaux')
    .setPlaceholder('Choisissez un réseau')
    .addOptions([
      {
        label: 'Twitch',
        description: 'Chaine Twitch',
        value: `Twitch`,
        emoji: ``,
      },
      {
        label: 'YouTube',
        description: 'Chaine youtube',
        value: `Youtube`,
        emoji: ``,
      },
      {
        label: 'Tiktok',
        description: 'Compte tiktok',
        value: `Tiktok`,
        emoji: ``,
      }
    ])
  ])
interaction.reply({
  content: 'Voici les plateformes / réseaux sociaux ou vous pouvez me retrouver :',
  components: [branchMenu],
  ephemeral: true,
});
}else if (interaction.isSelectMenu()){
  if(interaction.customId === "réseaux"){

    if (interaction.values[0] === "Youtube"){
      const youtube = new Discord.MessageEmbed()
        .setColor(color.rouge)
        .setDescription("https://www.youtube.com/channel/UCxqruUoare-3qIPZJFoKL7w")
        
      await interaction.update({
        content: "Voici ma chaine YouTube :",
        components: [],
        embeds: [youtube],
        ephemeral: true
      })
      
    }
    if (interaction.values[0] === "Twitch"){
      const twitch = new Discord.MessageEmbed()
        .setColor(color.violet)
        .setDescription("https://twitch.tv/fast_theo")
        
      await interaction.update({
        content: "Voici ma chaine Twitch :",
        components: [],
        embeds: [twitch],
        ephemeral: true
      })
      
    }
    if (interaction.values[0] === "Tiktok"){
      const tiktok = new Discord.MessageEmbed()
        .setColor('FF4F67')
        .setDescription("https://www.tiktok.com/@fast_theo")
        
      await interaction.update({
        content: "Voici mon compte tiktok:",
        components: [],
        embeds: [tiktok],
        ephemeral: true
      })
      
    }

  }
}

});

client.login(config.DISCORD_TOKEN);