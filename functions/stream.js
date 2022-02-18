const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync("db.json");
const db = low(adapter);

const db_t = db.get("config_twitch").value()[0];


async function IsValidToken(acces_token, callback) {
    const opt = {
        method: 'GET',
        headers: {
            "Client-ID": "w99wz4lfit4fdpezvolnydhkzo2m3j",
            "Authorization": `Bearer ${acces_token}`
        }
    }

    let response = !(await (await fetch('https://api.twitch.tv/helix/channels?broadcaster_id=480253356', opt)).json()).error;

    callback(acces_token, response)
}


async function GET_streamInfo(streamerID) {
    let tokenOfAuthorization;

    await IsValidToken(db_t.access_token, function (token, response) {
        if (response === false) { return UPDATE_AuthToken(streamerID) }

        tokenOfAuthorization = token
    })

    let opt = {
        method: 'GET',
        host: "api.twitch.tv",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenOfAuthorization}`,
            "Client-ID": `${db_t.Client_ID}`,
        }
    }

    return (await fetch(`https://api.twitch.tv/helix/streams?user_id=${streamerID.trim()}`, opt)).json()
}

async function UPDATE_AuthToken(streamerID) {
    const opt = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    await fetch(`https://id.twitch.tv/oauth2/token?client_id=${db_t.Client_ID}&client_secret=${db_t.client_secret}&grant_type=client_credentials&scope=user:read:email`, opt).then(res => res.json()).then((json) => {

        db.get("config_twitch").find({ access_token: db_t.access_token }).assign({ access_token: json.access_token }).write()

        db_t.access_token = json.access_token

        
    });
}

module.exports = { IsValidToken, UPDATE_AuthToken, GET_streamInfo }