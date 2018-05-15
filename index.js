const express = require('express');
const app = express();
const JSONStream = require('JSONStream')
const fs = require("fs");
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(serveStatic(__dirname + "/dist"));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));


const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const mountains = {
  'crystal': [(46.9282  * 1e7) , (-121.5045  * 1e7)],
  'snoqual': [(47.43916491 * 1e7), (-121.424331636 * 1e7)],
  'vail' : [(39.6403  * 1e7), (-106.3742  * 1e7)],
  'copper': [(39.5021  * 1e7), (-106.1510  * 1e7)],
  'breck': [(39.4817  * 1e7), (-106.0384  * 1e7)]
}


io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  app.post('/', upload.single('file'), (req, res, next) => {
    console.log(req.params, req.body, req.file)
    res.json({
      status: 'file recieved'
    });

    let lastMatchDate = '';

    let array = [];
    let dates = [];

    let stream = fs.createReadStream(req.file.path),
        parser = JSONStream.parse('*.*');
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
            type === 'ON_BICYCLE' &&
            confidence > 70)
          ) {
          array.push(obj);
          dates.push(currentDate);
          lastMatchDate = currentDate;
          return;
        }
      }

    });

    parser.on('end', () => {
      socket.emit('generic', 'done');
      socket.emit('recieve', JSON.stringify({
        locations: array,
        dates: dates.reverse()
      }));
      fs.unlink(req.file.path, (err) => {
        if (err) throw err;
        console.log(req.file.path + ' was deleted');
      });
    });

  });
});

http.listen(process.env.PORT || 8081, () => {
  console.log('API listening');
});
