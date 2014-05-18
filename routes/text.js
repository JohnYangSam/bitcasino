var express = require('express');
var router = express.Router();
var utilities = require('../utilities');
var User = require('../models/user');

var helpMessage = "Actions:\n" +
          "balance\n" +
          "bet <# satoshi>\n" +
          "roll\n" +
          "withdraw <# satoshi>\n\n"+
          "Send to XX address to deposit.";

/* Redirect based on response . */
router.post('/', function(req, res) {
  // Validate request is from twilio
  if (req.twilio.validateExpressRequest(req, process.env.TWILIO_AUTH_TOKEN)) {

    console.log("--------User Text recieved----------");

    // Extract body parameters
    var body = req.param('Body').trim();
    body = body.toLowerCase();
    var to = req.param('To').trim();
    var from = req.param('From').trim();

    // Check if user exists. Create a user if not
    User.findByNumber(from, function(err, user) {
      if (err) {
        console.log("Error looking up user " + err);
      } else {

        // Create a new User
        if (user === null) {
          var newUser = new User({
            number: from,
            balance: 0,
            btcAddress:
          });
          newUser.save(function(err, user) {
            console.log("Error saving new user.")
          });
          console.log(newUser);

        // Otherwise, parse the commands
        } else {

        }

        console.log("users is here" + user);

        //

      }
    });


    // Create a new Twmil response
    var twiml = new req.twilio.TwimlResponse();

    switch(body) {
      case "options":
        twiml.sms("\n" + helpMessage);
        break;

      default:
        twiml.sms("\n\n(Unknown Command)\n" + helpMessage);
        break;
    }

    console.log("--------Twiml response sending back ----------");
    console.log(twiml);
    res.send(twiml.toString());

  } else {
    console.log("--------Request from non Twilio Server----------");
    res.send('Request did not come from Twilio. Please go away.');
  }

});

module.exports = router;
