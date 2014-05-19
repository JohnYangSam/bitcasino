var express = require('express');
var router = express.Router();
var utilities = require('../utilities');
var User = require('../models/user');

var helpMessage = "Options:\n\n" +
          "balance\n" +
          "bet [satoshi amount]\n" +
          "roll\n" +
          "withdraw [BTC address]\n"+
          "info\n" +
          "options\n\n" +
          "Deposit Address: XXXX XXXX XXXXXXXXX.";

var infoMessage = ""

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
      } else {

        // Create a new User
        if (user === null) {


          var newUser = new User({
            number: from,
            balance: 0,
            btcAddress: null
          });
          newUser.save(function(err, user) {
            if (err) {
              console.log("Error saving new user." + err);
            } else {
              console.log("Successfully saved new user." + user);
            }
          });
          console.log(newUser);
          user.generateAddress();
        // Otherwise, parse the commands
        } else {

        }
        console.log("users is here" + user);
        //
      }
    });

      // If there is no user
      } else if (req.user === null) {
        createUser(req, res, function(req, res) {
          sendSmsMessage(req, res, "Welcome to Bitcasino!\n\n" + helpMessage);
        });

      } else { // There is an existing user
        respondToCommand(req, res, user);
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
function respondToCommand(req, res, user) {
  var msg = "";
  var args = req.body.split(' ');
  var cmd = args[0];
  switch(cmd) {
    case "bet":
      if (args.length !== 2) {
        sendSmsMessage(req, res, "bet [satoshi amount] requires two arguments");
      } else if (!utilities.isInt(args[1])) {
        sendSmsMessage(req, res, "bet [satoshi amount] requires an integer argument");
      } else {
        user.setBet(args[1], function(err) {
          if (err) {
            sendSmsMessage(req, res, "Error placing bet: " + err);
          } else {
            sendSmsMessage(req, res, "Your bet is set to " + args[1] + 
              " satoshi per a die role");
          }
        });
      }
      break;

    case "withdraw":
      if (args.length !== 2) {
        sendSmsMessage(req, res, "withdraw [BTC address] requires a BTC address to widthraw to");
      } else {
      /*
        user.withdraw(args[1], function(amount) { 
          sendSmsMessage(req, res, "withdrawing X satoshi to address. It should arrive shortly.");
        });
      */
      }
      break;
      
    case "balance":
    /*
      user.getBalance(function(amount) {
        sendSmsMessage(req, res, "Your balance is " + amount + " mBTC.");
      });
    */
    break;

    case "info":
      sendSmsMessage(req, res, infoMessage);
      break;

    case "options":
      msg = "\n" + helpMessage;
      break;

    case "roll":
      // check balance
      // If balance is good
      // Roll dice + based on the result
      // update user
      // return message
      break;

    default:
      sendSmsMessage(req, res, "(Unknown Command)\n\n" + helpMessage);
      break;
  }
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
