// Inspired by https://github.com/crabasa/votr-part1/blob/master/utils.js

var utils = {};

var MAX_SMS_LEN = 160;

utils.toSMS = function (string) {
  var result = "";
  if (string.length < MAX_SMS_LEN) {
    result = string;
  } else {
    result = substring(0, MAX_SMS_LEN - 3) + "...";
  }
  return result;
}

utils.isInt = function (string) {
  var intRegex = /^\d+$/;
  return intRegex.test(string);
}

module.exports = utils;