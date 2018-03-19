const express = require('express');
const app = express();
const JSONStream = require('JSONStream')
const fs = require("fs");

app.get('/api', (req, res) => {

  var array = [];

  var stream = fs.createReadStream('./static/location.json'),
      parser = JSONStream.parse('*.*');

  res.set('Access-Control-Allow-Origin', '*')

  stream.pipe(parser);

  parser.on('data', function (obj) {
    if (obj.latitudeE7 > (47.3823 * 1e7) && obj.latitudeE7 < (47.4023 * 1e7)) {
      array.push(obj)
    }
  });

  parser.on('end', function () {
    res.json(array);
  });

});

app.listen(8081, () => {
  console.log('API listening');
});
