var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var client = new twilio.RestClient(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
var utilities = require('../utilities');

/* Redirect based on response . */
router.post('/', function(req, res) {
  console.log(req);
  var body = req.param('Body').trim();
  console.log(body);
});


module.exports = router;
