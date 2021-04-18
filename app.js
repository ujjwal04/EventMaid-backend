const express = require('express');

const app = express();

app.get('/', (req, res, next) => {
  res.send('Hello World');
});

app.listen(8000, () => {
  console.log('Listening at port 8000');
});
