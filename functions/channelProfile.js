/**
 * This file is responsible for creating and updating channel profile
 */

var pg = require('pg');
const config = require('../config/default.json');
var channelAnnouncement = require('../controllers/channelAnnouncement');
const axios = require('axios').default;

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
 * This function is responsible for fetching critical information about a channel from blockstream.info API
 * It fetches long transaction id of channel, closing transaction id (if any) and closing block height
 * @param {*} scid - short channel id
 * @param {*} data - data containing info about tx_id, block height and output index
 * @param {*} node_id_1 - 1st node
 * @param {*} node_id_2 - 2nd node
 * @param {*} channelsRawData - Raw channel data for carrying out operation in a sequence
 * @param {*} i - iterator
 */
async function getIt(scid,data,node_id_1,node_id_2,channelsRawData,i) {
  await axios.get(`https://blockstream.info/api/block-height/${data.block}`)
    .then(function (response) {
      axios.get(`https://blockstream.info/api/block/${response.data}/txids`)
        .then(function (result) {
          axios.get(`https://blockstream.info/api/tx/${result.data[data.tx_id]}`)
            .then(function (txid) {
              
              axios.get(`https://blockstream.info/api/tx/${txid.data.txid}/outspends`)
                .then(function (result) {
                  let closingArray = []
                  let closingHeight = []
                  for(let i=0;i<result.data.length;i++){
                    if(result.data[i].spent){
                      closingArray.push(`'${result.data[i].txid}'`)
                      closingHeight.push(`'${result.data[i].status.block_height}'`)
                    }else{
                      closingArray.push(`'${false}'`)
                      closingHeight.push(`'${false}'`)
                    }
                  }
                  client.query(`
                    INSERT INTO channel_profile
                    (scid, amount_sat, closing_height, block, tx_id, output_index, node_id_1, node_id_2, txid, closing)
                    VALUES (${scid}, ${txid.data.fee}, ARRAY [${closingHeight}], ${data.block}, ${data.tx_id}, ${data.output_index}, '${node_id_1}', '${node_id_2}', '${txid.data.txid}', ARRAY [${closingArray}]);
                    `, (error, results) => {
                      if (error) {
                        throw error
                      }
                    })
                    if(i < channelsRawData.rows.length - 1) {
                      i++;
                      populateChannelProfile(channelsRawData, i);
                    }
                })
          })
      })
  })
}

/**
 * This function starts the process of creating as well as updating the channel profile
 * @param {*} channelsRawData - Raw channel data
 * @param {*} i - iterator
 */
async function populateChannelProfile (channelsRawData, i) {
  client.query(`
    SELECT * FROM channel_profile
    WHERE scid = ${channelsRawData.rows[i].scid};
    `, (error, results) => {
      console.log(results.rows.length)
      console.log('Added: ',i," channels")
      if (error) {
        // do nothing if scid already exists
        throw error
      }else  {
        if (!results.rows.length) {
          const parsedData = channelAnnouncement.channelAnnouncementParser(channelsRawData.rows[i].raw,channelsRawData.rows[i].scid)
          const channelData = parsedData.short_channel_id;
          parsedData.node_id_1 = parsedData.node_id_1.toString();
          parsedData.node_id_2 = parsedData.node_id_2.toString();
          
          getIt(channelsRawData.rows[i].scid,channelData,parsedData.node_id_1,parsedData.node_id_2,channelsRawData,i)
        } else {
          if(i < channelsRawData.rows.length - 1) {
            i++;
            populateChannelProfile(channelsRawData, i);
          }
        }
     }
  })
}

/**
 * This function is reponnsible for checking if the Channel_profile table exists in the database or not
 */
const createChannelProfile = () => {
    client.query(`
    CREATE TABLE IF NOT EXISTS channel_profile
    (
      scid BIGINT,
      amount_sat INTEGER,
      closing_height TEXT[],
      block BIGINT, 
      tx_id BIGINT, 
      output_index BIGINT,
      node_id_1 TEXT,
      node_id_2 TEXT,
      txid TEXT,
      closing TEXT[]
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
        populateChannelProfile(channelsRawData,0)
      })
    })
  }

module.exports = {
    createChannelProfile
}