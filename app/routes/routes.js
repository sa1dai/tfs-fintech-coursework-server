const utils = require('../utils/index');
const ObjectID = require("mongodb").ObjectID;
const apiBase = '/api';

const transformBoard = ({ _id: id, title, url_id }) => {
  return { id, title, url: encodeURI(`/b/${url_id}/${title}`) };
};

module.exports = function(app, db) {
  // создание доски
  app.post(`${apiBase}/boards`, (req, res) => {
    const board = {
      title: req.body.title,
      url_id: utils.getRandomString()
    };

    db.collection('boards').insert(board, (err, item) => {
      if (err) {
        res.send({ 'error': 'An error has occurred - ' + err });
      } else {
        const { url } = transformBoard(item.ops[0]);
        res.send({ url });
      }
    });
  });

  // получение всех досок
  app.get(`${apiBase}/boards`, (req, res) => {
    db.collection('boards').find().toArray(function(err, items) {
      res.send(items.map(item => transformBoard(item)));
    });
  });

  // удаление всех досок
  app.delete(`${apiBase}/boards`, (req, res) => {
    db.collection('boards').remove({ }, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('All boards deleted!');
      }
    });
  });

  // получение доски по id
  app.get(`${apiBase}/boards/:id`, (req, res) => {
    db.collection('boards').find({ url_id: req.params.id }).toArray(function(err, items) {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(transformBoard(items[0]));
      }
    });
  });

  // удаление доски по id
  /*app.delete(`${apiBase}/boards/:id`, (req, res) => {
    const id = req.params.id;
    const details = { 'url_id': id };

    db.collection('boards').remove(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Board ' + id + ' deleted!');
      }
    });
  });*/
};