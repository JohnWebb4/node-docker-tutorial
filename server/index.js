/* eslint no-console: 0 */
const redis = require('redis');
const express = require('express');

const client = redis.createClient(6379, 'redis');

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
  console.log('Received Knock');

  const connected = client.get('count', (err, value) => {
    if (err) {
      console.log(`Error: ${err}`);
    }

    // value is undefined if error
    client.incr('count', redis.print);
    res.send(`Knock ${value}`);
  });

  if (!connected) {
    res.send('Knock, but no Redis');
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
