var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var utilities = require('../utilities');

var helpMessage = "Actions:\n" +
          "balance\n" +
          "bet <# satoshi>\n" +
          "roll\n" +
          "widthraw <# satoshi>"+
          "Send to XX address to deposit";

/* Redirect based on response . */
router.post('/', function(req, res) {
  // Validate request is from twilio
  if (twilio.validateExpressRequest(req, process.env.TWILIO_AUTH_TOKEN)) {

    console.log("--------Got here----------");

    // Extract body parameters
    var body = req.param('Body').trim();
    var to = req.param('To').trim();
    var from = req.param('From').trim();

    var twiml = new twilio.TwimlResponse();

    switch(body) {
      case 
      case
      case
      case
      case
      case "help":
        twiml.sms(helpMessage);
        break;
      default:
        twmil.sms("Unknown Command:\n" + helpMessage);
        break;
    }
    
    console.log(twiml);
    console.log("--------sent back----------");

    res.send(twiml.toString());

  } else {
    console.log("--------bad request----------");
    res.send('Request did not come from Twilio. Please go away.');
  }

});

module.exports = router;
