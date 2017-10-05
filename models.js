
const mongoose = require('mongoose');
module.exports = function(mongoURL){
  mongoose.Promise = global.Promise;

  mongoose.connection.on("error", function(err){
    console.log(err);
  })

  mongoose.connect(mongoURL);

  const WaiterSchema = mongoose.Schema(
    {
      username : String,
      days: [String]
    });

  WaiterSchema.index({username : 1}, { unique : true});

  const Waiters = mongoose.model('Waiters', WaiterSchema);

  return{
    Waiters
  };
}
