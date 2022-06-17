var pg = require('pg');
const config = require('../config/default.json');
var channelAnnouncement = require('../controllers/channelAnnouncement');
var channelUpdate = require('../controllers/channelUpdate');
var nodeAnnouncement = require('../controllers/nodeAnnouncement');

// PostgreSQL connection
const port = config.server.port;
const host = config.server.host;
const username = config.server.username;
const password = config.server.password;
const dbName = config.server.dbName;
var conString = `${username}://${username}:${password}@${host}:${port}/${dbName}`;
var client = new pg.Client(conString);
client.connect();

const getChannelInfo = (request, response) => {
  client.query('SELECT * FROM "channel_announcements" LIMIT 1;', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(channelAnnouncement.channelAnnouncementParser(results.rows[0].raw,results.rows[0].scid))
  })
}

const getChannelUpdate = (request, response) => {
  client.query('SELECT * FROM "channel_updates" LIMIT 1;', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(channelUpdate.channelUpdateParser(results.rows[0].raw,results.rows[0].scid,results.rows[0].direction,results.rows[0].timestamp))
  })
}

const nodeInfo = (request, response) => {
  client.query('SELECT * FROM "node_announcements" LIMIT 1;', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(nodeAnnouncement.nodeAnnouncementParser(results.rows[0].raw,results.rows[0].node_id))
  })
}

module.exports = {
    getChannelInfo,
    getChannelUpdate,
    nodeInfo
}