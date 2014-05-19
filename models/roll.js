

var roll = function(cb) {
  var results = {};
  results.roll_comp = Math.floor(Math.random() * 6) + 1;
  results.roll_human = Math.floor(Math.random() * 6) + 1;

  if (results.roll_comp >= results.roll_human) {
    results.win = false;
  } else {
    results.win = true;
  }
  return results;
}

module.exports = roll;
