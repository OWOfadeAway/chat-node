var express = require('express');
var router = express.Router();
const {sendRes} = require('../utlis/resTemplete')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/login', function(req,res,next){
  res.send(new sendRes({type:'res',msg:'',code:200}))
})
module.exports = router;
