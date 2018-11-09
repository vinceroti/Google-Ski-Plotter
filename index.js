const express = require('express');

const app = express();
const JSONStream = require('JSONStream');
const fs = require('fs');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const unzipper = require('unzipper');

app.use(serveStatic(`${__dirname}/dist`));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const mountains = {
  crystal: [46.9282 * 1e7, -121.5045 * 1e7],
  snoqual: [47.43916491 * 1e7, -121.424331636 * 1e7],
  stevens: [47.7448 * 1e7, -121.089 * 1e7],
  vail: [39.6403 * 1e7, -106.3742 * 1e7],
  copper: [39.5021 * 1e7, -106.151 * 1e7],
  breck: [39.4817 * 1e7, -106.0384 * 1e7],
  loveland: [39.68 * 1e7, -105.8979 * 1e7],
  abasin: [39.6423 * 1e7, -105.8717 * 1e7],
  keystone: [39.6045 * 1e7, -105.9545 * 1e7],
  timberline: [45.3311 * 1e7, -121.711 * 1e7],
  whistler: [50.115 * 1e7, -122.9486 * 1e7],
  skicooper: [39.3608 * 1e7, -106.3028 * 1e7],
};

app.post('/', upload.single('file'), (req, res, next) => {
  console.log(req.body, req.file);

  const socketId = req.body.socketId;
  res.json({
    status: 'file recieved',
  });

  let lastMatchDate = '';

  const array = [];
  const dates = [];

  const stream = fs.createReadStream(req.file.path).pipe(unzipper.ParseOne());

  const parser = JSONStream.parse('*.*');
  stream.pipe(parser);

  parser.on('data', (obj) => {
    const currentDate = new Date(parseInt(obj.timestampMs)).toDateString();
    if (lastMatchDate === currentDate) {
      return;
    }
    for (const mountain in mountains) {
      if (obj.activity) {
        var type = obj.activity[0].activity[0].type;
        var confidence = obj.activity[0].activity[0].confidence;
      }
      if (
        obj.latitudeE7 > mountains[mountain][0] - 300000 &&
        obj.latitudeE7 < mountains[mountain][0] + 300000 &&
        (obj.longitudeE7 > mountains[mountain][1] - 300000 &&
          obj.longitudeE7 < mountains[mountain][1] + 300000 &&
          type === 'ON_BICYCLE' &&
          confidence > 10)
      ) {
        array.push(obj);
        dates.push(currentDate);
        lastMatchDate = currentDate;
        return;
      }
    }
  });

  parser.on('end', () => {
    io.to(socketId).emit(
      'done',
      JSON.stringify({
        locations: array.reverse(),
        dates: dates.reverse(),
      }),
    );
    fs.unlink(req.file.path, (err) => {
      if (err) throw err;
      console.log(`${req.file.path} was deleted`);
    });
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(process.env.PORT || 8081, () => {
  console.log('API listening');
});
