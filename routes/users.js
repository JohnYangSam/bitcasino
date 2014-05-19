var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Users' });
  //res.send('respond with a resource');
});

router.get('/update_balance', function(req, res) {

  var amount = parseInt(req.param('value').trim());
  var address = req.param('input_address').trim();
  console.log('Handling request to /update_balance');
  console.log(amount);
  console.log(address);
  User.findByAddress(address, function(err, user){
    console.log(user);
    user.addBalance(amount, function(err, user){
      if (err) {
        console.log("Error looking up user " + err);
      } else {
        console.log("Balanced increased.");
        user.sendBalanceUpdatedText();
        console.log(user.balance);
      }
    });
  });
  res.send(200);
});
module.exports = router;
