const Discord = require('discord.js');
const fs = require('fs');
const path = require("path");

const client = new Discord.Client();

const prefix = '.'

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


const token = JSON.parse(fs.readFileSync("./token.json"));
client.login(token);

client.on('ready', () => {

    console.log(`${client.user.username} est lancé et connecté à discord `)

    const games  = [
        "Bot officiel",
        ".help"
    ];

    client.user.setActivity(games[0])
    let i = 1;
    setInterval(function(){
        client.user.setActivity(games[parseInt(i, 10)], {
            type: "STREAMING",
            url: "https://www.twitch.tv/fast_theo"
        });

        if(games[parseInt(i+1)]) i++;
        else i = 0
    }, 5000)

})


client.on('guildMemberAdd', member => {
    var embed = new Discord.MessageEmbed()
    .setTitle("Bienvenue !")
    .setDescription("**Bienvenue à** " + member + " **sur le discord, n'oublie pas de lire le règlement !**")
    .setColor("13FF00")
    .setThumbnail(member.user.avatarURL)
    .setTimestamp()
    member.guild.channels.get('857243833745408040').send(embed)
})

client.on('guildMemberRemove', member => {
    var embed = new Discord.MessageEmbed()
    .setTitle("Départ")
    .setDescription("**A bientôt** " + member + " **!**")
    .setColor(color.rouge)
    .setTimestamp()
    member.guild.channels.get('857243833745408040').send(embed)

})


var reactionmsgid = "878021518993551360"
client.on("ready", (reaction, user) => {
    var guild = client.guilds.cache.get('')
    var channel = client.channels.cache.get('857254851283779604')
channel.messages.fetch(reactionmsgid).then(m => {
        console.log("Cached reaction message.");
    })
})

client.on("messageReactionAdd", (reaction, user) => {
    var guild = client.guilds.cache.get('857239343706144839')
    if(reaction.emoji.id == "878027641096142948" && reaction.message.id === reactionmsgid) 
        {
            guild.members.fetch(user)
                .then((member) => 
                {
                    member.roles.add("857244205659586580")
                    .then(() => 
                    {
                        console.log(`Added the role to ${member.displayName}`);
                    }
                    );
                });
        }
})
client.on('message', async message => {
    if (message.content.startsWith(prefix + "ping")) {
      message.delete()
      let début = Date.now()
      message.channel.send('Ping').then(async(m) => await m.edit(`Pong : ${Date.now() - début} ms`)).then(message => {
          message.delete(10000)
})
}
if(message.content.startsWith(prefix + "help")){
    message.delete()
    message.reply("<a:validegif:857248111620522055> **Check tes MP !**").then(message => {
        message.delete({ timeout: 15000 })
    })
    let result = new Discord.MessageEmbed()
    .setColor("F7FF00")
    .setAuthor("Menu d'aide :", client.user.avatarURL)
    .setDescription("Le bot est en cours de développement , patience , des fonctionnalités vont être ajoutées très prochainement !")
    .setThumbnail("https://cdn.discordapp.com/attachments/619964533498445844/621315650345893918/embed.png")
    .setTimestamp()
    message.member.createDM().then(c => c.send(result))
}
// Candidatures
  if(message.content.startsWith(prefix + "candidno")){
    message.delete()
    var args = message.content.split(" ").slice(1);
    let dUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args);
    if (!dUser) return  message.reply("<a:gifvalidepas:706552843947212842> (ERREUR) **Veuillez mentionner un utilisateur !**").then(message => {
        message.delete({ timeout: 15000 })
    })
    if(!message.member.hasPermission("MANAGE_ROLES")) return message.reply("<a:gifvalidepas:706552843947212842> (ERREUR) **Vous n'avez pas la permission pour excuter cette commande !**").then(message => {
        message.delete({ timeout: 15000 })
    })
    var embed = new Discord.RichEmbed()
    .setAuthor("ValLives Bot , réponse candidature :", client.user.avatarURL)
    .setDescription("Bonjour, \n premièrement, merci de porter de l'intérêt à la chaine ValLives ! \n Votre candidature à été étudiée par un administrateur , nous vous annoncons que celle ci est **refusée** \n Vous pouvez contacter l'administrateur qui a traité votre candidature pour avoir la raison de votre refus. \n Cordialement.")
    .setThumbnail("https://cdn.discordapp.com/attachments/696076502701441064/706817303160946708/Logo_val_ver_512sansbord.png")
    .setFooter(`Candid traitee par : ${message.author}`, message.author.avatarURL)
    .setColor("FF0000")
    .setTimestamp()
    dUser.send(embed)
    if(dUser.send){
        var embed = new Discord.RichEmbed()
        .setAuthor("Réponse candidature :", client.user.avatarURL)
        .setDescription(`La candidature de ${dUser} à été **refusée** par ${message.author}`)
        .setColor("00C1FF")
        .setThumbnail("https://cdn.discordapp.com/attachments/623563880081129473/624313647220654113/faux_png.png")
        .setTimestamp()
        message.guild.channels.get('705873785659588628').send(embed)
    }
}
if(message.content.startsWith(prefix + "candidyes")){
    message.delete()
    var args = message.content.split(" ").slice(1);
    let dUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args);
    if (!dUser) return  message.reply("<a:gifvalidepas:706552843947212842> (ERREUR) **Veuillez mentionner un utilisateur !**").then(message => {
        message.delete({ timeout: 15000 })
    })
    if(!message.member.hasPermission("MANAGE_ROLES")) return message.reply("<a:gifvalidepas:706552843947212842> (ERREUR) **Vous n'avez pas la permission pour excuter cette commande !**").then(message => {
        message.delete({ timeout: 15000 })
    })
    var embed = new Discord.RichEmbed()
    .setAuthor("ValLives Bot , réponse candidature :", client.user.avatarURL)
    .setDescription(`Bonjour, \n premièrement, merci de porter de l'intérêt à la chaine ValLives ! \n Votre candidature à été étudiée par un administrateur , nous vous annoncons que celle ci est **acceptée** \n Un administrateur vous contactera pour pouvoir s'entretenir oralement. \n Cordialement. \n\n *Candidature traitée par ${message.author}*`)
    .setColor("17FF00")
    .setTimestamp()
    dUser.send(embed)
    dUser.addRole('706832003772842055')
    if(dUser.send){
        var embed = new Discord.RichEmbed()
        .setAuthor("Réponse candidature :", client.user.avatarURL)
        .setDescription(`La candidature de ${dUser} à été **acceptée** par ${message.author}`)
        .setColor("00C1FF")
        .setThumbnail("https://cdn.discordapp.com/attachments/623563880081129473/624313626697793619/vrai_png.png")
        .setTimestamp()
        message.guild.channels.get('705873785659588628').send(embed)
    }
} 
})

client.on('message', function (message) {
    let args = message.content.trim().split(/ +/g)
    if (!message.guild) return
    if (message.content.startsWith(prefix + "ban")) {
        message.delete()
       if (!message.member.hasPermission('BAN_MEMBERS')) return message.reply("<a:validepasgif:701032668044722227> (ERREUR) **Vous n'avez pas la permission d'utiliser cette commande !").then(message => {
        message.delete({ timeout: 15000 })
       })
       let args = message.content.trim().split(/ +/g)
       let reason = args.slice(2).join(' ')
       if (!reason) return message.channel.send("<a:gifvalidepas:706552843947212842> (ERREUR) **Veuillez indiquer une raison**").then(message => {
        message.delete({ timeout: 15000 })
       })
       let member = message.mentions.members.first()
       if (!member) return message.reply("<a:validepasgif:701032668044722227> (ERREUR) **Veuillez mentionner un utilisateur !**").then(message => {
        message.delete({ timeout: 15000 })
       })

       if (!member.bannable) return message.channel.send("<a:validepasgif:701032668044722227> (ERREUR) **Impossible de ban le membre !**").then(message => {
        message.delete({ timeout: 15000 })
       })
       if(member.bannable){
        var banmember = new Discord.MessageEmbed()
        .setAuthor("Fast Théo Bot - Bannissement :", client.user.avatarURL)
        .setDescription(`Vous avez été banni du serveur par ${message.author}`)
        .setColor(color.rouge)
        .setTimestamp()
        member.send(banmember)
    }
      
    member.ban({reason: reason})

       if(member.ban){
        var logchannel = client.channels.cache.get('857244366576943125')
        var log = new Discord.MessageEmbed()
        .setAuthor("Fast Théo Bot - Bannissement :", client.user.avatarURL)
        .setDescription(`${member} **a été banni du serveur** par ${message.author} \n**Raison :** ${reason}`)
        .setColor("FF0000")
        .setTimestamp()
        logchannel.send(log)
    }
    }
 
    if (message.content.startsWith(prefix + "kick")) {
        message.delete()
       if (!message.member.hasPermission('KICK_MEMBERS')) return message.reply("<a:validepasgif:701032668044722227> (ERREUR) **Vous n'avez pas la permission d'utiliser cette commande !**").then(message => {
           message.delete(10000)
       })
       let args = message.content.trim().split(/ +/g)
       let reason = args.slice(2).join(' ')
       if (!reason) return message.channel.send("<a:gifvalidepas:706552843947212842> (ERREUR) **Veuillez indiquer une raison**").then(message => {
           message.delete(10000)
       })
       let member = message.mentions.members.first()
       if (!member) return message.reply("<a:validepasgif:701032668044722227> (ERREUR) **Veuillez mentionner un utilisateur !**").then(message => {
           message.delete(10000)
       })
       if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.reply(":x: (ERREUR) **Vous ne pouvez pas exclure cet utilisateur !**").then(message => {
           message.delete(10000)
       })
       if (!member.kickable) return message.reply("<a:validepasgif:701032668044722227> (ERREUR) **Impossible de kick le membre !**").then(message => {
           message.delete(10000)
       })
       var kickmember = new Discord.MessageEmbed()
       .setAuthor("Fast Théo Bot - Expulsion :", client.user.avatarURL)
       .setDescription(`Vous avez été expulsé du serveur par ${message.author}`)
       .setColor(color.rouge)
       .setTimestamp()
       member.send(kickmember)

       member.kick()
       if(member.kick){
        var log = new Discord.MessageEmbed()
        .setAuthor("Fast Théo Bot - Expulsion :", client.user.avatarURL)
        .setDescription(`${member} **a été expulsé du serveur** par ${message.author} \n **Raison :** ${reason}`)
        .setColor("F7FF00")
        .setTimestamp()
        message.guild.channels.get('710239191849631864').send(log)
    }
    }

 
    if (message.content.startsWith(prefix + "clear")) {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("<a:validepasgif:701032668044722227> (ERREUR) **Vous n'avez pas la permission d'utiliser cette commande**").then(message => {
            message.delete(10000)
        })
        let count = parseInt(args[1])
        if (!count) return message.channel.send("<a:validepasgif:701032668044722227> (ERREUR) **Veuillez indiquer un nombre de messages à supprimer !**").then(message => {
            message.delete(10000)
        })
        if (isNaN(count)) return message.channel.send("<a:validepasgif:701032668044722227> (ERREUR) **Veuillez indiquer un nombre valide !**").then(message => {
            message.delete(10000)
        })
        if (count < 1 || count > 100) return message.channel.send("<a:validepasgif:701032668044722227> (ERREUR) **Veuillez indiquer un nombre entre 1 et 100 !**").then(message => {
            message.delete(10000)
        })
        message.channel.bulkDelete(count + 1, true)
    }
 
    if (message.content.startsWith(prefix + "mute")) {
        message.delete()
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("<a:validepasgif:701032668044722227> (ERREUR) **Vous n'avez pas la permission d'utiliser cette commande !**").then(message => {
            message.delete(10000)
        })
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("<a:validepasgif:701032668044722227> (ERREUR) **Membre introuvable !**").then(message => {
            message.delete(10000)
        })
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("<a:validepasgif:701032668044722227> (ERREUR) **Vous ne pouvez pas mute ce membre !**").then(message => {
            message.delete(10000)
        })
        if (!member.manageable) return message.channel.send("<a:validepasgif:701032668044722227> (ERREUR) **Impossible de mute le membre !**").then(message => {
            message.delete(10000)
        })
        const muterole = message.guild.roles.find('name', 'Muet');
        if (muterole) {
            member.addRole(muterole)
            member.removeRole('694490388949631048')
            if(member.addRole)
                var embed = new Discord.RichEmbed()
                .setColor("00C1FF")
                .setTitle("Mute :", client.user.avatarURL)
                .setDescription(`${member} **à été mute sur le serveur** par ${message.author}`)
                message.guild.channels.get('710239191849631864').send(embed)
            }
    }
    if (message.content.startsWith(prefix + "unmute")) {
        message.delete()
        let muterole = message.guild.roles.find(role => role.name === 'Muet')
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("<a:validepasgif:701032668044722227> (ERREUR) Vous n'avez pas la permission d'utiliser cette commande.").then(message => {
            message.delete(10000)
        })
        let member = message.mentions.members.first()
        if(!member) return message.channel.send("<a:validepasgif:701032668044722227> (ERREUR) **Membre introuvable**").then(message => {
            message.delete(10000)
        })
        if(!muterole) return message.channel.send("<a:validepasgif:701032668044722227> (ERREUR) Impossible de unmute le membre").then(message => {
            message.delete(10000)
        })
        if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("<a:validepasgif:701032668044722227> (ERREUR) Vous ne pouvez pas unmute ce membre.").then(message => {
            message.delete(10000)
        })
        if(!member.manageable) return message.channel.send("<a:validepasgif:701032668044722227> (ERREUR) Impossible de unmute le membre").then(message => {
            message.delete(10000)
        })
        if(muterole && member.roles.has(muterole.id)) member.removeRole(muterole)
        member.addRole('694490388949631048')
        if(member.removeRole){
            var embed = new Discord.RichEmbed()
            .setColor("00C1FF")
            .setTitle("Mute :", client.user.avatarURL)
            .setDescription(`${member} **à été unmute sur le serveur** par ${message.author}`)
            message.guild.channels.get('710239191849631864').send(embed)
        }
    }
    })

