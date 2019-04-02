const ObjectID = require("mongodb").ObjectID;
const apiBase = '/api';

module.exports = function(app, db) {
  // создание доски
  app.post(`${apiBase}/boards`, (req, res) => {
    const board = { title: req.body.title };

    db.collection('boards').insert(board, (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred - ' + err });
      } else {
        res.send(result.ops[0]);
      }
    });
  });

  // получение всех досок
  app.get(`${apiBase}/boards`, (req, res) => {
    db.collection('boards').find().toArray(function(err, items) {
      res.send(items);
    });
  });

  // получение доски по id
  app.get(`${apiBase}/boards/:id`, (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };

    db.collection('boards').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      }
    });
  });

  // удаление доски по id
  app.delete(`${apiBase}/boards/:id`, (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };

    db.collection('boards').remove(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Note ' + id + ' deleted!');
      }
    });
  });
};