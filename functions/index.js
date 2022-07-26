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

const createChannelProfile = (request, response) => {
    client.query(`
    CREATE TABLE IF NOT EXISTS channel_profile
    (
      scid BIGINT,
      amount_sat INTEGER,
      funding_txid VARCHAR,
      block BIGINT, 
      tx_id BIGINT, 
      output_index BIGINT
    );
    `, (error, results) => {
      if (error) {
        throw error
      }
      client.query(`
      SELECT * FROM "channel_announcements";
      `, (error, channelsRawData) => {
        if (error) {
          throw error
        }
        let channelList = []
        channels : for (let i = 0; i < channelsRawData.rows.length; i++) {
          client.query(`
          SELECT * FROM channel_profile
          WHERE scid = ${channelsRawData.rows[i].scid};
          `, (error, results) => {
            if (error) {
              // do nothing if scid already exists
              throw error
            }else  {
              if (results.rows.length === 0) {
                const parsedData = channelAnnouncement.channelAnnouncementParser(channelsRawData.rows[i].raw,channelsRawData.rows[i].scid)
                const channelData = parsedData.short_channel_id;
                channelList.push(channelsRawData.rows[i].scid)
                client.query(`
                INSERT INTO channel_profile
                (scid, amount_sat, funding_txid, block, tx_id, output_index)
                VALUES (${channelsRawData.rows[i].scid}, 0, 0, ${channelData.block}, ${channelData.tx_id}, ${channelData.output_index});
                `, (error, results) => {
                  if (error) {
                    throw error
                  }
                })
              } else {
  
              }
            }
          })
        }
        console.log('task finished')
        response.status(200).json(channelList)
      })
    })
  }
  
  const updateChannelProfile = (request, response) => {
    client.query(`
    SELECT * FROM "channel_profile" LIMIT 1;
    `, (error, channelProfiles) => {
      if(error){
        throw error
      }
      for (let i = 0; i < channelProfiles.rows.length; i++) {
        client.query(`
        SELECT * FROM channel_updates
        WHERE scid = ${channelProfiles.rows[i].scid};
        `, (error, results) => {
          if (error) {
            throw error
          }
          for(let j = 0; j < results.rows.length; j++){
            console.log(channelUpdate.channelUpdateParser(results.rows[j].raw,results.rows[j].scid,results.rows[j].direction,results.rows[j].timestamp))
          }
        })
      }
    })
    response.status(200).json('task finished')
  }

module.exports = {
    createChannelProfile,
    updateChannelProfile
}