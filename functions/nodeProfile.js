/**
 * This file is responsible for creating and updating node_profiles
 */

var pg = require('pg');
const config = require('../config/default.json');
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

const checkNodeProfile = () => {
    client.query(`
    CREATE TABLE IF NOT EXISTS node_profile
    (
      node_id TEXT,
      scid BIGINT[],
      rgb_color TEXT
    );
    `, (error, results) => {
        if(error) {
            throw error;
        }
    })
}

const createNodeProfile = (offset) => {
    // perform a check if node_profile table exists, if not create it
    checkNodeProfile()

    // fetch node_announcement gossip message
    client.query(`
    SELECT * FROM "node_announcements" LIMIT 5000 OFFSET ${offset};
    `, (error,results) => {
        if(error) {
            throw error
        }

        // iterate over each node
        for(let i=0;i<results.rows.length;i++) {
            const node_data = nodeAnnouncement.nodeAnnouncementParser(results.rows[i].raw,results.rows[i].node_id)

            // Check if node already has a profile
            client.query(`SELECT * FROM "node_profile" WHERE node_id = '${node_data.node_id}';`, (error, nodeProfile) => {
                if(error) {
                    throw error;
                }

                if(!nodeProfile.rows.length) {    
                    // fetch all the channel_profile linked with this node
                    client.query(`
                    SELECT * FROM "channel_profile"
                    WHERE node_id_1 = '${node_data.node_id}' OR node_id_2 = '${node_data.node_id}';`, (error, channels) => {
                        if(error) {
                            throw error;
                        }
                        const temp = []
                        for(let j=0;j<channels.rows.length;j++) {
                            temp.push(`${channels.rows[j].scid}`)
                        }
                        if (channels.rows.length == 0) {
                           // Inserting node_profile into table
                            client.query(`
                            INSERT INTO node_profile (node_id, rgb_color) VALUES ('${node_data.node_id}', '${node_data.rgb_color}');`, (error, results) => {
                                if(error) {
                                    throw error;
                                }
                                console.log('This node has no channels linked')
                            }) 
                        } else {
                            // Inserting node_profile into table
                            client.query(`
                            INSERT INTO node_profile (node_id, scid, rgb_color) VALUES ('${node_data.node_id}', ARRAY [${temp}], '${node_data.rgb_color}');`, (error, results) => {
                                if(error) {
                                    throw error;
                                }
                                console.log('This node has: ', channels.rows.length, ' channels')
                            })
                        }
                    })
                }
            })
        }
    })
}

module.exports = {
    createNodeProfile,
    checkNodeProfile
}