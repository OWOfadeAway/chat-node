const { log } = require('debug/src/node');
var express = require('express');
var router = express.Router();
const chat = require('./ws/chat')
const chatroom = require('./ws/chatroom')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use('/',chat)
router.use('/',chatroom)
module.exports = router;
