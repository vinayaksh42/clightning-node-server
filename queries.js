const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'historian_bitcoin',
  password: 'password',
  port: 5432,
})

const getChannelInfo = (request, response) => {
    pool.query('SELECT * FROM "channel_announcements";', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

module.exports = {
    getChannelInfo
  }