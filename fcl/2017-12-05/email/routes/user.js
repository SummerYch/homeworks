var express = require('express');
var router = express.Router();
var base = require('./base');
var debug = require('debug')('log');
var userGet = function(req) {
  // process
  var id = req.params.id;
  debug('log:' + id);
};

router.get(['/users/:id', '/users'], userGet);

router.post(['/users/:id', '/users'], function(req, res) {
  var receiver = req.body.receiver;
  var content = req.body.content;
  var title = req.body.title;
  var userInfo = req.session.userInfo;
  base(function(con) {
    if (receiver !== '' && content !== '' && title !== '') {
      var sql = 'select *from mailbox where address =\'' + receiver + '\';';
      con.query(sql, function(err, result) {
        if (err) {
          throw err;
        }
        if (result.length !== 0) {
          var sql2 = 'INSERT INTO mail (sender,title,content,receiver) VALUES(\'' + userInfo + '\',\'' + title + '\',\'' + content + '\',\'' + receiver + '\');';
          con.query(sql2, function(err) {
            if (err) {
              throw err;
            }
            var sql3 = 'UPDATE user set states = \'receivedMail\' where id = ' + result[0].id + ';';
            con.query(sql3, function(err) {
              if (err) {
                throw err;
              }
            });
            var sql4 = 'select *from mail where receiver =\'' + userInfo + '\';';
            con.query(sql4, function(err, result4) {
              if (err) {
                throw err;
              }
              var title = result4[0].title;
              var content = result4[0].content;
              var sender = result4[0].sender;
              res.render('mail', { name: userInfo, sender: sender, title: title, content: content });
            });

          });
        } else {
          res.render('user');
        }
      });
    } else {
      res.render('user');
    }
  }, 'emailSystem');
});
