const express = require('express');
const app = express();

const port = 8000;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:F2At}r@cluster0-n7vis.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

client.connect(err => {
  if (err) {
    console.log(err);
  }

  require('./app/routes')(app, client.db("tfs-coursework-spring-2019"));

  app.listen(port, () => {
    console.log('We are live on ' + port);
  });
});


