const express = require('express');
const app = express();

const port = 8000;

const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(require('./config/db').url, { useNewUrlParser: true });

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors')
app.use(cors());

client.connect(err => {
  if (err) {
    console.log(err);
  }

  require('./app/routes')(app, client.db("tfs-coursework-spring-2019"));

  app.listen(port, () => {
    console.log('We are live on ' + port);
  });
});


