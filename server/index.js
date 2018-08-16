/* eslint no-console: 0 */
const redis = require('redis');
const express = require('express');

const client = redis.createClient();

const app = express();
const PORT = process.env.PORT || 8000;

// Handle Redis connection
client.on('connect', () => {
  console.log('Connected to Redis!');
});

client.on('error', (err) => {
  console.log(`Error: ${err}`);
});

// Reset knock count
client.set('count', 0, redis.print);

// Handle server
app.get('/', (req, res) => {
  client.get('count', (err, value) => {
    if (err) {
      console.log(`Error: ${err}`);
      res.send('');
      return;
    }

    res.send(`Knock ${value}`);
  });

  client.incr('count', redis.print);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
