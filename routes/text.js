var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var client = new twilio.RestClient(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
var utilities = require('../utilities');

/* Redirect based on response . */
router.post('/', function(req, res) {
  var body = req.param('Body').trim();
  var to = req.param('To').trim();
  var from = req.param('From').trim();


  client.sendMessage({
        to: to,
        from: from,
        body: "this is a test"
      });

  switch(body) {
    default:
      console.log("default hit");
      client.sendMessage({
        to: to,
        from: from,
        body: "this is a test"
      });
      break;
  }
  console.log("--------sent back----------");

});
module.exports = router;
