var express = require('express');
var router = express.Router();
var utilities = require('../utilities');
var User = require('../models/user');
var roll = require('../models/roll');

var helpMessage = function(user) {
  var msg = "Options:\n\n" +
          "balance\n" +
          "bet [satoshi amount]\n" +
          "roll\n" +
          "withdraw [BTC address]\n"+
          "info\n" +
          "options";

   if (user) msg += "\n\nDeposit Address: " + user.address;
   return msg;
};

var infoMessage = "Bitcasino is a simple game. Deposit satoshi to your address." +
                  " Roll the dice. Higher roll takes all. House wins ties.";

/* Redirect based on response . */
router.post('/', function(req, res){
  handleText(req, res);
});

/* Use this route for testing */
router.get('/', function(req, res){
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

      } else if (req.user === null) {
        createUser(req, res, function(req, res) {
          respondWithSmsMessage(req, res, "Welcome to Bitcasino!\n\n" + helpMessage(user));
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
      user.generateAddress();
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
        respondWithSmsMessage(req, res, "bet [satoshi amount] requires two arguments");
      } else if (!utilities.isInt(args[1])) {
        respondWithSmsMessage(req, res, "bet [satoshi amount] requires an integer argument");
      } else {
        user.setBet(args[1], function(err) {
          if (err) {
            respondWithSmsMessage(req, res, "Error placing bet: " + err);
          } else {
            respondWithSmsMessage(req, res, "Your bet is set to " + args[1] +
              " satoshi per a die role");
          }
        });
      }
      break;

    case "withdraw":
      if (args.length !== 2) {
        respondWithSmsMessage(req, res, "withdraw [BTC address] requires a BTC address to widthraw to");
      } else {
      /*
        user.withdraw(args[1], function(amount) {
          respondWithSmsMessage(req, res, "withdrawing X satoshi to address. It should arrive shortly.");
        });
      */
      }
      break;

    case "balance":
      // As long as we don't update anything, we don't need a callback
      respondWithSmsMessage(req, res, "Your balance is " + user.balance + " Satoshi.");
      break;

    case "game":
      respondWithSmsMessage(req, res, infoMessage);
      break;

    case "option":
    case "options":
      msg = "\n" + helpMessage(user);
      break;

    case "roll":
      console.log("!!!!!!!! ROROROROROORLLLONG");
      if(!user.bet){
        respondWithSmsMessage(req, res, "You need to set a bet amount before playing!")
      }
      if(user.balance < user.bet) {
        console.log("!!!!!!!! NOT enough balance!");
        respondWithSmsMessage(req, res, "Your balance (" + user.balance + ") is lower than your bet (" + user.bet + ")")
      break;
      }

      roll_result = roll();
      console.log("!!!!!!!! roolling actually!");
      var earnings = user.bet;
      var msg = "Congrats! You rolled " + roll_result.roll_human
              + " and we rolled " + roll_result.roll_comp + "."
              + " You won " + earnings + " Satoshi!";
      if(!roll_result.win){
        earnings = user.bet * -1;
        var msg = "Unfortunately, you rolled " + roll_result.roll_human
              + " and we rolled " + roll_result.roll_comp + "."
              + " You lost " + user.bet + " Satoshi.";
      }

      user.addBalance(earnings, function(){
        respondWithSmsMessage(req, res, msg);
      });
      break;

    default:
      respondWithSmsMessage(req, res, "(Unknown Command)\n\n" + helpMessage(user));
      break;
  }
}

// Respond by sending a Twmil sms message response
function respondWithSmsMessage(req, res, msg) {
  console.log("Send msg: ");
  console.log(msg);
  // Create new Twmil response
  var twiml = new req.twilio.TwimlResponse();
  twiml.sms(msg);
  console.log("--------Twiml response sending back ----------");
  console.log(twiml);
  res.send(twiml.toString());
}

module.exports = router;
