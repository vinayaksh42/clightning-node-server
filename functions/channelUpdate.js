/**
 * This file is responsible for fetching all the channel updates linked to a channel
 */

var pg = require('pg');
const config = require('../config/default.json');
var channelUpdate = require('../controllers/channelUpdate');

// PostgreSQL connection
const port = config.server.port;
const host = config.server.host;
const username = config.server.username;
const password = config.server.password;
const dbName = config.server.dbName;
var conString = `${username}://${username}:${password}@${host}:${port}/${dbName}`;
var client = new pg.Client(conString);
client.connect();

/**
 * This function is responsible for fetching all the required channel updates for a channel
 * @param {*} scid - short channel id 
 */
const fetchChannelUpdates = (scid) => {
    client.query(`
    SELECT * FROM "channel_updates" WHERE scid = ${scid};
    `, (error, results) => {
        if(error){
            throw error
        }
        let temp = []
        for (let i = 0; i < results.rows.length; i++) {
            temp[i] = (channelUpdate.channelUpdateParser(results.rows[i].raw,results.rows[i].scid,results.rows[i].direction,results.rows[i].timestamp))
        }
        return temp;
    })
}

module.exports = {
    fetchChannelUpdates
}