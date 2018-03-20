const express = require('express');
const app = express();
const JSONStream = require('JSONStream')
const fs = require("fs");

const mountains = {
  'crystal': [(46.9282  * 1e7) , (-121.5045  * 1e7)],
  'snoqual': [(47.43916491 * 1e7), (-121.424331636 * 1e7)],
  'vail' : [(39.6403  * 1e7), (-106.3742  * 1e7)],
  'copper': [(39.5021  * 1e7), (-106.1510  * 1e7)],
  'breck': [(39.4817  * 1e7), (-106.0384  * 1e7)]
}

app.get('/api', (req, res) => {
  let lastMatchDate = '';

  let array = [];
  let dates = [];

  let stream = fs.createReadStream('./static/location-full.json'),
      parser = JSONStream.parse('*.*');

  res.set('Access-Control-Allow-Origin', '*')

  stream.pipe(parser);

  parser.on('data',  (obj) => {
    var currentDate = new Date(parseInt(obj.timestampMs)).toDateString()
    if (lastMatchDate === currentDate) {
      return;
    }
    for (let mountain in mountains) {
      if (obj.activity) {
        var type = obj.activity[0].activity[0].type;
        var confidence = obj.activity[0].activity[0].confidence;
      }
      if (
        (obj.latitudeE7 > (mountains[mountain][0] - 300000) && obj.latitudeE7 < (mountains[mountain][0]  + 300000)) &&
        (obj.longitudeE7 > (mountains[mountain][1] - 300000) && obj.longitudeE7 < (mountains[mountain][1]  + 300000) &&
          type === 'ON_BICYCLE')
        ) {
        array.push(obj);
        dates.push(currentDate);
        lastMatchDate = currentDate;
        return;
      }
    }

  });

  parser.on('end', () => {
    res.json({
      locations: array,
      dates: dates.reverse()
     });
  });

});

app.listen(8081, () => {
  console.log('API listening');
});
