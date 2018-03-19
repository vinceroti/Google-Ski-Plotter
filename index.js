const express = require('express');
const app = express();
const JSONStream = require('JSONStream')
const fs = require("fs");

const mountains = {
  'crystal': [(46.9282  * 1e7) , (-121.5045  * 1e7)],
  'snoqual': [(47.43916491 * 1e7), (-121.424331636 * 1e7)]
}

app.get('/api', (req, res) => {

  let array = [];

  let stream = fs.createReadStream('./static/location-full.json'),
      parser = JSONStream.parse('*.*');

  res.set('Access-Control-Allow-Origin', '*')

  stream.pipe(parser);

  parser.on('data',  (obj) => {
    for (let mountain in mountains) {
      if (
        (obj.latitudeE7 > (mountains[mountain][0] - 300000) && obj.latitudeE7 < (mountains[mountain][0]  + 300000)) &&
        ((obj.longitudeE7 > (mountains[mountain][1] - 300000) && obj.longitudeE7 < (mountains[mountain][1]  + 300000)))
        ) {
        array.push(obj);
        return;
      }
    }

  });

  parser.on('end', () => {
    res.json(array);
  });

});

app.listen(8081, () => {
  console.log('API listening');
});
