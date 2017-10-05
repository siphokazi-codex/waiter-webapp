const assert = require('assert');
const Models = require('../models');

describe('models should be able to', function(){

  var models = Models('mongodb://localhost/waiters-test');

    beforeEach(function(done) {
     models.Waiters.remove({}, function(err, results){
         done(err);
       })
     });

  it('store waiters entered by user to MongoDB', function(done){

    var waiterData = { username : 'The test waiters'};
    models.Waiters
      .create(waiterData, function(err){
        if (err) {
          return done(err);
        }

         models.Waiters.find(waiterData, function(err, username){
             assert.equal(1, username.length);
             done(err);
         });
      });
  });

    it('should not allow duplicate waiters numbers', function(done){
      var waiterData = {
      waiterData: 'The test waiterData'
    };
    models.Waiters
      .create(waiterData, function(err) {
        if (err) {
          return done(err);
        }
        //done(err);
        models.Waiters.create(waiterData, function(err, waiterData) {
          assert.ok(err, "Duplicate value exception should have been thrown!");
          //  assert.equal(1, waiterData.length);
          done();
        });

      });
    });
});
