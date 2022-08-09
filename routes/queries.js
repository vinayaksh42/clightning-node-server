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

// Query for testing channel_announcements
const getChannelInfo = (request, response) => {
  client.query('SELECT * FROM "channel_announcements" LIMIT 1;', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(channelAnnouncement.channelAnnouncementParser(results.rows[0].raw,results.rows[0].scid))
  })
}

// Query for testing channel_updates
const getChannelUpdate = (request, response) => {
  client.query('SELECT * FROM "channel_updates" LIMIT 1;', (error, results) => {
    if (error) {
      throw error
    }
    console.log(results.rows[0].raw)
    response.status(200).json(channelUpdate.channelUpdateParser(results.rows[0].raw,results.rows[0].scid,results.rows[0].direction,results.rows[0].timestamp))
  })
}

// Query for testing node_announcement
const nodeInfo = (request, response) => {
  client.query('SELECT * FROM "node_announcements" LIMIT 1;', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(nodeAnnouncement.nodeAnnouncementParser(results.rows[0].raw,results.rows[0].node_id))
  })
}

// Query for returning info about a particular channel
const getChannelProfile = (request, response) => {
  console.log(request.params.scid)
  client.query(`SELECT * FROM "channel_profile" WHERE scid = ${request.params.scid};`, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows[0])
  })
}

// Query for returning all channel_updates related to a channel
const getChannelUpdates = (request, response) => {
  client.query(`
    SELECT * FROM "channel_updates" WHERE scid = ${request.params.scid};
    `, (error, results) => {
      if(error){
          throw error
      }
      let temp = []
      for (let i = 0; i < results.rows.length; i++) {
          temp[i] = (channelUpdate.channelUpdateParser(results.rows[i].raw,results.rows[i].scid,results.rows[i].direction,results.rows[i].timestamp))
      }
      response.status(200).json(temp)
  })
}

module.exports = {
    getChannelInfo,
    getChannelUpdate,
    nodeInfo,
    getChannelProfile,
    getChannelUpdates
}