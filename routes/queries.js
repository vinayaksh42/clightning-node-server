var pg = require('pg');
const config = require('../config/default.json')
var parser = require('../controllers/channelAnnouncement');

// PostgreSQL connection
const port = config.server.port
const host = config.server.host
const username = config.server.username
const password = config.server.password
const dbName = config.server.dbName
var conString = `${username}://${username}:${password}@${host}:${port}/${dbName}`;
var client = new pg.Client(conString);
client.connect();

const getChannelInfo = (request, response) => {
    client.query('SELECT * FROM "channel_announcements" LIMIT 2;', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(parser.channelAnnouncementParser(results.rows[0].raw))
    })
}

module.exports = {
    getChannelInfo
}