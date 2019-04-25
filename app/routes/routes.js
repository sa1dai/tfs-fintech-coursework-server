const utils = require('../utils/index');
const apiBase = '/api';

const transformBoard = ({ _id: id, title, url_id, columns }) => {
  return { 
    id, title, url: encodeURI(`/b/${url_id}/${title}`), columns
  };
};

module.exports = function(app, db) {
  // создание доски
  app.post(`${apiBase}/boards`, (req, res) => {
    const board = {
      title: req.body.title,
      url_id: utils.getRandomString(),
      columns: []
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
    db.collection('boards').remove({ }, (err) => {
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

  // сохранение доски по id
  app.put(`${apiBase}/boards/:id`, (req, res) => {
    const board = req.body;

    db.collection('boards').update(
      { url_id: req.params.id },
      { $set: { title: board.title, columns: board.columns } },
      (err) => {
        if (err) { 
          res.send({'error':'Save board failure'});
        } else {
          res.send('Save board success!');
        }
      }
    );
  });

  // удаление доски по id
  app.delete(`${apiBase}/boards/:id`, (req, res) => {
    const id = req.params.id;
    const details = { 'url_id': id };

    db.collection('boards').remove(details, (err) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Board ' + id + ' deleted!');
      }
    });
  });
};