const express = require('express');
const app = express();

const port = process.env.PORT || 8000;

const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(require('./config/db').url, { useNewUrlParser: true });

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cors = require('cors')
app.use(cors());

app.use((req, res, next) => {
	console.log(`${req.method} ${req.originalUrl}`)
  next();
});
app.use((req, res, next) => setTimeout(next, 1000));

client.connect(err => {
  if (err) {
    console.log(err);
  }

  require('./app/routes')(app, client.db("tfs-coursework-spring-2019"));

  app.listen(port, () => {
    console.log('Server starts on ' + port);
  });
});