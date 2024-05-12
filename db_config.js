const { Client } = require('pg');
const client = new Client({
  user: 'lpas',
  host: 'localhost',
  database: 'groceryapp',
  password: 'root',
  port: 5432,
});
client.connect();