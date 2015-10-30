var express     = require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var handler     = require('./server/utils/requestHandler.js');
var app         = express();
var PORT        = 6060;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/client'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(morgan('dev'));

var session = require('cookie-session')
app.use(session({
  name: 'session',
  secret: process.env.SESSION_SECRET || 'development',
  secure: (!! process.env.SESSION_SECRET),
  signed: true
}))

//if using browserify:
// app.get('/bundle.js')

app.get('/decks/shared', function(req, res){
  console.log("trying to get shared decks");
  handler.getShared(req,res)
  .then(function(shared){
    console.log("shared decks?",shared);
    res.send({decks: shared});
  })
  .catch(function(err){
    console.log("err getting decks:",err);
  })
})

app.post('/decks/shared', function(req, res){
  console.log("trying to share: ", req.body.deckName, req.body.deck);
  console.log(req.body);
  handler.shareDeck(req.body.deck, req.body.deckName)
  .then(function(answer){
    console.log("db answer: ", answer)
    res.send({message: "success", answer:answer})
  })
  .catch(function(err){
    console.log("error sharing deck " + req.deckName, err)
  })
})

// begin shortly borrowed stuff

app.post('/signup', function(req, res) {
  var user = handler.userExists(req.body.username)
  .then(function(answer){
    console.log("answer was: " + answer)
    if (answer !== null){
      console.log(req.body.username + " was taken")
      res.send({login: false, message: "That username is taken"});
      return null;
    } else if (answer === null) {
      return handler.makeUser(req, res);
    }
  })

  if (user !== null){
    user
    .then(function(x){
      console.log("this is returned from handler.makeUser: ", x)
      req.session.user = x._id;
      res.send({
        login: true, 
        mindSeal: { 
          userSettings: {
            username: x._id,
            newCardLimit: null,
            tValDefault: 128000000, 
            lastEdit: req.body.time, 
            todayCounter: 0,
            allTimeCounter: 0,
            cScaleDefault: {0: 0.9, 1: 1.2, 2: 1.8, 3: 2.5}
          },
          decks: {}
        }
      });
    })
    .catch(function(error){
      console.log("make user error: " + error);
      res.send({message:"failed.",error:error,login:false});
    })
  }

});

app.post('/login', function(req, res) {
  handler.login(req, res)
  .then(function(obj){
    if (obj.bool){
      console.log("username and password are valid. login granted.");
      req.session.user = obj.user;
      console.log("obj is:", obj)
      // var mindSeal = {decks:obj.decks, userSettings:obj.userSettings};
      // console.log("mindSeal sending:", mindSeal);
      res.status(200).send({
        login: true, 
        message:"Login Successful", 
        mindSeal: obj.mindSeal
      });
    }
    else {
      console.log("password invalid")
      res.status(401).send({login: false, message:"failed: password invalid."})
    }
  })
  .catch(function(error){
    console.log(error);
  })
});

app.post('/logout', function(req, res) {
  // console.log(req.body.mindSeal)
  handler.setMindSeal(req.session.user, req.body.mindSeal, req.body.time)
  .then(function(result){
    console.log('after setSettings', result)
    req.session.user = null; 
    res.status(200).send({
      logout: true, 
      message:"You have been successfully logged out.",
      result: result
    });
  })
  .catch(function(err){
    console.log("err caught logout server",err);
  })

});

app.post('/sync', function(req, res) {
  // console.log(req.body.mindSeal)
  console.log("syncing");
  handler.setMindSeal(req.session.user, req.body.mindSeal, req.body.time)
  .then(function(result){
    // console.log('after setSettings', result)
    res.status(200).send({
      success: true, 
      message:"sync successful.",
      result: result
    });
  })
  .catch(function(err){
    console.log("err caught while syncing",err);
  })

});

//OLD STUFF, REWRITE ALL


// app.post('/users',
//   // Create a new user account
//   function(req, res) {
//     handler.createUser(req, res);
//   }
// );

app.get('/decks', function(req, res) {
    // console.log(req.session);
    handler.userExists(req.session.user)
    .then(function(userObj){
      console.log("userObj:",userObj);
      if(!userObj){
        console.log("did not find " + username + " in database.");
        res.status(401).send({login:false, message:"failed: not a user."});
      }
      else {
        console.log("found user: " + userObj._id);
        res.send({login:true, user:userObj._id, mindSeal: {decks: userObj.decks, userSettings: userObj.userSettings}})
      } 
    })
  }
);

app.post('/decks', function(req, res) {
    console.log(req.session);
    handler.createDecks(req, res);
  }
  // Create a deck
  // req should look like { deckName: "deckname" }
  // res will contain new unique ID of newly created deck

);

app.get('/whoami', function(req,res){
  //definitely a security no-no. remove before production.
  console.log(req.session);
  res.send(req.session.user)
})

// app.post('/refresh',
//   // Refresh server decks
//   function(req, res) {
//     handler.refreshDecks(req, res);
//   }
// );

// app.delete('/decks',
//   // Delete a deck
//   function(req, res) {
//     res.send('Remove a deck!')
//   }
// );

// app.get('/decks/*',
//   // Get a specific deck
//   function(req, res) {
//     res.send(200, 'Get cards in ' + req.path)
//   }
// );

// app.post('/decks/*/cards',
//   // Update or create cards in a deck
//   // expects array of card objects that are newly user generated
//   //* === will be primary key of deck
//   function(req, res) {
//     var path = req.path;
//     res.send('Create a card in ' + path)
//   }
// );

// app.delete('/decks/*/cards',
//   // Delete a card (or cards)
//   function(req, res) {
//     handler.addCards(req, res)
//   }
// );

console.log('App is listening on port ' + PORT);
app.listen(PORT);
