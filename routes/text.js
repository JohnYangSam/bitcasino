var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var client = new twilio.RestClient(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
var utilities = require('../utilities');

/* Redirect based on response . */
router.post('/', function(req, res) {
  // Validate request is from twilio
  if (twilio.validateExpressRequest(req, process.env.TWILIO_AUTH_TOKENW)) {

    var body = req.param('Body').trim();
    var to = req.param('To').trim();
    var from = req.param('From').trim();

    var twiml = new twilio.TwimlResponse();

    switch(body) {
      default:

        console.log("default hit");
        twiml.sms("this is a test");
        break;
    }
    console.log(twiml);
    console.log("--------sent back----------");

    res.send(twiml);
  } else {
    res.send('Request did not come from Twilio. Please go away.');
  }

});
module.exports = router;
