var mongoose = require('mongoose');
var http = require('http');
var userSchema = new mongoose.Schema({
  number: {type: String, trim: true},
  btcAddress: {type: String, trim: true},
  balance: {type: Number, min: 0},
  bet: {type: Number, min: 0}
});

// Find a user by number
userSchema.statics.findByNumber = function(number, cb) {
  return this.findOne({ number: number}, cb);
};

userSchema.statics.findByAddress = function(address, cb) {
  return this.findOne({btcAddress: address}, cb);
};

// Check a user's balance is valid
userSchema.methods.hasBalance = function(amount) {
  return this.get("balance") >= amount;
};

// Subtract a given balance
userSchema.methods.subtractBalance = function(amount, cb) {
  var newBalance = this.get("balance") - amount;
  if (newBalance < 0) {
    console.log('Cannot have a balance less than 0.');
  } else {
    this.balance -= amount;
    this.save(cb);
  }
};

// Add a given balance
userSchema.methods.addBalance = function(amount, cb) {
  var newBalance = this.get("balance") + amount;
  if (newBalance < 0) {
    console.log('Cannot have a balance less than 0.');
  } else {
    this.balance += amount;
    this.save(cb);
  }
};

// Set a bet
userSchema.methods.setBet = function(amount, cb) {
  if (amount < 0) {
    if (cb) cb("Can't place a bet less than 0.");
  } else {
    this.bet = amount;
    this.save(cb);
  }
}

userSchema.methods.withdraw = function(address){
 var options = {
    host: 'blockchain.info',
    path: 'http://blockchain.info/merchant/'
        + '88654f1e-6cb8-4fb8-b0cd-5b1d91853f74'
        + '/payment?password=ThisIsTheBitCasino!!!!!'
        + 'to=' + address
        + '&amount=' + balance,
    method: 'GET',
  };
  var user = this;
  getJSON(options, function(statusCode, response){

  });
};

userSchema.methods.generateAddress = function(cb){

 var options = {
    host: 'blockchain.info',
    path: '/api/receive?method=create&address=1PcW7W8rrVAbPqUjDAh62k2tJaoSqRcRBn&callback_url=http://http://bitcasino-text.herokuapp.com/users/update_balance',
    method: 'GET',
  };
  var user = this;
  getJSON(options, function(statusCode, response){
    var user_address = response['input_address'];
    user.btcAddress = user_address;
    user.save(cb);
  });
};

function getJSON(options, onResult)
{
    console.log("rest::getJSON");

    var prot = http;
    var req = prot.request(options, function(res)
    {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
       console.log('error: ' + err.message);
    });

    req.end();
};

var User = mongoose.model("User", userSchema);

module.exports = User;

