// import { currentId } from 'async_hooks';
var debug = require('debug')('xxx');

var express = require('express');
var app = express();
var basic = require('./base');
var bodyParser = require('body-parser');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var currentUser = '11';
var ejs = require('ejs');

app.set('view engine', 'html');
app.engine('html', ejs.__express);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/' + 'login.html');
});

app.post('/main', urlencodedParser, function (req, res) {
  basic(function (con) {
    var username = req.body.username;
    var password = req.body.password;
    var sql = 'select * from user where username = \'' + username + '\'';
    con.query(sql, function (err, result) {
      if (err) throw err;
      if (result.length === 0) {
        debug('info'+'用户名不存在！请重新输入');
        res.location('/login');
      } else {
        result.forEach(function (item) {
          if (item.password !== password) {
            debug('info'+'密码不正确！');
            res.location('/login');
          } else {
            debug('info'+'user ' + username + ' login in');
            currentUser = username;
            res.sendFile(__dirname + '/public/' + 'main.html');
          }
        });
      }
    });
  }, 'mail');
});

app.get('/write', function (req, res) {
  res.sendFile(__dirname + '/public/' + 'write.html');
});
app.get('/read', urlencodedParser, function (req, res) {
  basic(function (con) {
    var id1 = 1;
    var address1 = '11';
    var title1 = '11';
    var content1 = '11';
    var sender1 = '11';
    debug('info'+title1);
    debug('info'+content1);
    debug('info'+sender1);
    var sql = 'select id from user where username = \'' + currentUser + '\'';
    con.query(sql, function (err, result) {
      if (err) throw err;
      result.forEach(function (item) {
        id1 = item.id;
      });
      var sql2 = 'select address from mailbox where user =\'' + id1 + '\'';
      con.query(sql2, function (err, result) {
        if (err) throw err;
        result.forEach(function (item) {
          address1 = item.address;
        });
        var sql3 = 'select * from mail where receiver =\'' + address1 + '\'';
        con.query(sql3, function (err, result) {
          if (err) throw err;
          debug('info'+result);
          result.forEach(function (item) {
            title1 = item.title;
            sender1 = item.sender;
            content1 = item.content;
          });
        });
      });
    });
  }, 'mail');
  res.sendFile(__dirname + '/public/' + 'read.html');
});
app.post('/login', urlencodedParser, function (req, res) {
  basic(function (con) {
    var username = req.body.username;
    var password = req.body.password;
    var address = req.body.address;
    var sql2 = 'select * from user where username =\'' + username + '\'';
    con.query(sql2, function (err, result) {
      if (err) throw err;
      if (result.length === 0) {
        var sql = 'insert into user(username,password) values(\'' + username + '\',\'' + password + '\')';
        con.query(sql, function (err, result) {
          if (err) throw err;
          debug('info'+'Data inserted');
          debug('info'+result);
        });
        debug('info'+'用户注册成功!');
        var sql3 = 'select id from user where username =\'' + username + '\'';
        con.query(sql3, function (err, result) {
          if (err) throw err;
          debug('info'+result);
          result.forEach(function (item) {
            debug('info'+item.id);
            debug('info'+result);
            var sql4 = 'insert into mailbox(user,address) values(\'' + item.id + '\',\'' + address + '\')';
            con.query(sql4, function (err, result) {
              if (err) throw err;
              debug('info'+result);
              debug('info'+'mailbox-Data inserted');
            });
          });

        });
        res.sendFile(__dirname + '/public/' + 'login.html');
      } else {
        debug('info'+'用户名已存在');
        res.sendFile(__dirname + '/public/' + 'register.html');
      }
    });

  }, 'mail');

});

app.post('/send', urlencodedParser, function (req, res) {
  basic(function (con) {
    var receiver = req.body.receiver;
    var title = req.body.title;
    var content = req.body.content;
    var sender = currentUser;
    var id1 = 11;
    var receiver1 = '11';
    var id2 = 22;
    debug('info'+receiver1);
    var sql = 'insert into mail(title,content,sender,receiver) values(\'' + title + '\',\'' + content + '\',\'' + sender + '\',\'' + receiver + '\')';
    con.query(sql, function (err, result) {
      if (err) throw err;
      debug('info'+result);
      debug('info'+'mail sended');
      debug('info'+currentUser);
      var sql2 = 'select id from mail where receiver =\'' + receiver + '\'';
      con.query(sql2, function (err, result) {
        if (err) throw err;
        result.forEach(function (item) {
          id1 = item.id;
        });
        var sql3 = 'select id from mailbox where address =\'' + receiver + '\'';
        con.query(sql3, function (err, result) {
          debug('info'+result);
          if (err) throw err;
          if (result.length === 0) {
            debug('info'+'目标邮箱不存在！');
          } else {
            result.forEach(function (item) {
              debug('info'+result);
              debug('info'+item.id);
              id2 = item.id;
              debug('info'+id2);
              var sql4 = 'insert into mail_mailbox(mail,mailbox) values(' + id1 + ',' + id2 + ')';
              con.query(sql4, function (err, result) {
                if (err) throw err;
                debug('info'+result);
                debug('info'+'mail_mailbox updated');
              });
            });
          }


        });
      });
    });
  }, 'mail');
  debug('info'+'邮件发送成功!');
  res.sendFile(__dirname + '/public/' + 'main.html');
});
app.get('/quit', urlencodedParser, function (req, res) {
  debug('info'+'user-' + currentUser + '-quit');
  res.sendFile(__dirname + '/public/' + 'login.html');
});
app.listen(3000);