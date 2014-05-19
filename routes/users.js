var express = require('express');
var router = express.Router();
var User = require('../models/user');
var twilio = require('twilio');
var client = new twilio.RestClient(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

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
        res.send(200);
        console.log("Balanced increased.");
        console.log(user.balance);
        sendSmsMessageToUser(user, "Balance increased by " + amount + " to " + user.balance + " satoshi.");
      }
    });
  });
});

// Send an sms message to the user with a given message
// and following call back
function sendSmsMessageToUser(user, message, cb) {
  client.sms.messages.create({
    to: user.number,
    from: process.env.TWILIO_NUMBER,
    body: message
  }, cb);
}

module.exports = router;
