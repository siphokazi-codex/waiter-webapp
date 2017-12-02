
module.exports = function(models) {

  var monday = [];
  var tuesday = [];
  var wednesday = [];
  var thursday = [];
  var friday = [];
  var saturday = [];
  var sunday = [];

  const getForm = function(req, res, next) {

    const username = req.params.username;

    models.Waiters.find({}, function(err, checkWaiters) {
      if (err) {
        return next(err);
      }

      res.render('waiters/add', {
        username
      });
    });
  };

  const colorDays = function(color){
    if(color === 3){
      return "colorThree";
    }
    if(color < 3){
      return "colorTwo";
    }
    if(color > 3){
      return "colorOne";
    }
}

  const getWaiter = function(req, res, next) {

    var shifts = {
      Monday : {
        waiters : []
      },
      Tuesday : {
        waiters : []
      },
      Wednesday : {
        waiters : []
      },
      Thursday : {
        waiters : []
      },
      Friday : {
        waiters : []
      },
      Saturday : {
        waiters : []
      },
      Sunday : {
        waiters : []
      }
    }

    models.Waiters.find({}, function(err, waiter) {
      if (err){
        return next(err);
      }

      waiter.forEach(function(waiterSchedule) {
        waiterSchedule.days.forEach(function(day){
          shifts[day].waiters.push(waiterSchedule.username);
            //console.log(waiterSchedule.username);
        })
      })

      res.render("waiters/admin", {
        data : shifts,
        monday : colorDays(shifts.Monday.waiters.length),
        tuesday : colorDays(shifts.Tuesday.waiters.length),
        wednesday : colorDays(shifts.Wednesday.waiters.length),
        thursday : colorDays(shifts.Thursday.waiters.length),
        friday : colorDays(shifts.Friday.waiters.length),
        saturday : colorDays(shifts.Saturday.waiters.length),
        sunday : colorDays(shifts.Sunday.waiters.length)
      })
    })
  }

  const add = function(req, res, next) {

    var username = (req.params.username).substr(0,1).toUpperCase() + (req.params.username).substr(1).toLowerCase()

    var waiterShifts = {
      username,
      days : req.body.days
    }

    if (!waiterShifts || !waiterShifts.days) {
      req.flash('error', 'Please select the days you wish to work');
      res.redirect('/waiters/' + username);
    } else {
        models.Waiters.findOne({username : waiterShifts.username}, function(err, results){
          if (err){
              return next(err);
          }
          else if (results) {
              models.Waiters.update({username : waiterShifts.username}, { $set: { days: req.body.days } }, function(err, results){

                   })
                   req.flash('addWaiter', 'Welcome back ' + waiterShifts.username + ', you have changed your shift day(s): ' + waiterShifts.days)
                   req.flash('error', 'Your day(s) have been modified successfully.');
                   res.redirect('/waiters/' + username);
            }
          else {
            models.Waiters.create(waiterShifts, function(err, results) {

              req.flash('error', 'Your have selected this day(s) to work: ' + waiterShifts.days);
              req.flash('addWaiter', 'Your shift day(s) has been successfully saved ' + waiterShifts.username);
              res.redirect('/waiters/' + username);
            })
          }
        })
      }
    }

    const resetFields = function(req, res, next) {
      models.Waiters.remove({}, function(err, remove){

      if (err) {
        return next(err);
      }
      else {
      res.redirect('/waiters/admin');
      }
    });
  }

  // var users = {
  //   "admin" : "admin",
  //   "Andre" : "waiter"
  // };
  //
  // var userRole = users[req.session.username];
  //
  // const logout = function(req, res, next){
  //
  //   delete req.session.username;
  //   req.session.destroy;
  //   res.redirect("/login");
  // }
  //
  // const access_denied = function(req, res){
  //   res.render("access denied");
  // }
  //
  // const login = function(req, res, next){
  //
  //     let username = req.body.username;
  //
  //     (if !userRole req.session.username && req.body.password ===){
  //       req.session.username = req.body.username;
  //       res.redirect("waiters/" + username);
  //     }
  //     else {
  //       res.redirect("/login");
  //     }

      //Suppose to be on index.js file
      // if (req.session.username == null){
      //
      // }
      // if (req.path !== "/login"){
      //   return res.redirect("/login")
      // }
      // next();
  //}

// generating counter of each person greeted

  return {
    getWaiter,
    getForm,
    add,
    resetFields
  }
}
