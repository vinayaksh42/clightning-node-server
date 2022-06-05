var pg = require('pg');
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'historian_bitcoin',
//   password: 'password',
//   port: 5432,
// })

var conString = "postgres://postgres:password@localhost:5432/historian_bitcoin";

var client = new pg.Client(conString);
client.connect();

const getChannelInfo = (request, response) => {
    client.query('SELECT * FROM "channel_announcements" LIMIT 1;', (error, results) => {
      if (error) {
        throw error
      }
      const temp = String.fromCharCode(results.rows[0].raw.data);
      results.rows[0].raw.data = JSON.parse(temp);
      response.status(200).json(results.rows)
    })
}

module.exports = {
    getChannelInfo
  }