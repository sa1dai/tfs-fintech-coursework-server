const ObjectID = require("mongodb").ObjectID;
const apiBase = '/api';

const transformBoard = ({ _id: id, title }) => {
  return { id, title };
}

module.exports = function(app, db) {
  // создание доски
  app.post(`${apiBase}/boards`, (req, res) => {
    console.log(req.body);
    const board = { title: req.body.title };

    db.collection('boards').insert(board, (err, item) => {
      if (err) {
        res.send({ 'error': 'An error has occurred - ' + err });
      } else {
        res.send(transformBoard(item.ops[0]));
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
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };

    db.collection('boards').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(transformBoard(item));
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
        res.send('Board ' + id + ' deleted!');
      }
    });
  });
};