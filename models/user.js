var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  number: {type: String, trim: true},
  btcAddress: {type: String, trim: true},
  balance: {type: Number, min: 0}
});

// Find a user by number
userSchema.statics.findByNumber = function(number, cb) {
  return this.findOne({ number: number}, cb);
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
    this.save(cb);
  }
};

// Add a given balance
userSchema.methods.addBalance = function(amount, cb) {
  var newBalance = this.get("balance") + amount;
  if (newBalance < 0) {
    console.log('Cannot have a balance less than 0.');
  } else {
    this.save(cb);
  }
};

userSchema.methods

var User = mongoose.model("User", userSchema);

module.exports = User;
