var express = require('express');
var router = express.Router();
var utilities = require('../utilities');
var User = require('../models/user');

var helpMessage = "Options:\n" +
          "balance\n" +
          "bet [mBTC amount]\n" +
          "roll\n" +
          "withdraw [mBTC amount]\n"+
          "info\n" +
          "options\n\n" +
          "Deposit Address: XXXX XXXX XXXXXXXXX.";

/* Redirect based on response . */
router.post('/', function(req, res){
  handleText(req, res);
});
router.get('/', function(req, res){
  /*
  req.to = "000 000 0000";
  req.from = "111 111 1111";
  req.body = "tester";
  */
  handleText(req, res);
});

function handleText(req, res) {

  // Validate request is from twilio
  if (true || req.twilio.validateExpressRequest(req, process.env.TWILIO_AUTH_TOKEN)) {

    console.log("--------User Text recieved----------");

    // Extract body parameters
    req.body = req.param('Body').trim().toLowerCase();
    req.to = req.param('To').trim();
    req.from = req.param('From').trim();

    // Look up user
    User.findByNumber(req.from, function(err, user) {
      req.user = user;
      // Error on look up
      if (err) {
        console.log("Error looking up user " + err);

      // If there is no user
      } else if (req.user === null) {
        createUser(req, res, function(req, res) {
          sendSmsMessage(req, res, "Welcome to Bitcasino!\n\n" + helpMessage);
        });

      } else { // There is an existing user
        respondToCommand(req, res);
      }
    });

  } else {
    console.log("--------Request from non Twilio Server----------");
    res.send('Request did not come from Twilio. Please go away.');
  }
}

// Create a new User
function createUser(req, res, cb) {

  var newUser = new User({
    number: req.from,
    balance: 0,
    btcAddress: "something"
  });

  newUser.save(function(err, user) {
    if (err) {
      console.log("Error saving new user." + err);

    } else {
      req.user = user;
      console.log("Successfully saved new user." + user);
      // Execute the next callback
      if (cb) cb(req, res);
    }
  });
}

// Responds to a command
function respondToCommand(req, res) {
  var msg = "";

  switch(req.body) {
    case "options":
      msg = "\n" + helpMessage;
      break;

    default:
      msg = "\n\n(Unknown Command)\n" + helpMessage;
      break;
  }
  sendSmsMessage(req, res, msg);
}

// Respond by sending a Twmil sms message response
function sendSmsMessage(req, res, msg) {
  // Create new Twmil response  
  var twiml = new req.twilio.TwimlResponse();
  twiml.sms(msg);
  console.log("--------Twiml response sending back ----------");
  console.log(twiml);
  res.send(twiml.toString());
}

module.exports = router;
