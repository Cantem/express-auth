const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const app = express();

const pgp = require('pg-promise')();
const db = pgp({
    host: 'localhost',
    port: 5432,
    database: process.env.DATABASE,
    user: process.env.USERNAME,
    password: process.env.PASSWORD
});

// create temporary storage for login data
const storage = {
  1: {
    id: 1,
    username: 'bob',
    password: 'pass'
  },
  2: {
    id: 2,
    username: 'top',
    password: 'secret'
  }
};

// helper function to get user by username
function getUserByUsername(username){
  return db.one('SELECT * FROM customer WHERE username=$1', [username])
    .then(function(user){
      return user;
    })
    .catch(function(error){
      return null;
    });
}

function getUserById(id){
  return db.one('SELECT * FROM customer WHERE id=$1', [id])
    .then(function(user){
      return user;
    })
    .catch(function(error){
      return null;
    });
}

app.set('view engine', 'hbs');
app.use('/static', express.static('static'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'some random text',
  resave: false,
  saveUninitialized: false
}));

// serialise user into session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// deserialise user from session
passport.deserializeUser(function(id, done) {
  getUserById(id).then(function(user){
    done(null, user);
  });
});

// configure passport to use local strategy
// that is use locally stored credentials
passport.use(new LocalStrategy(
  function(username, password, done) {
    getUserByUsername(username)
    .then(function(user){
      if (!user) return done(null, false);
      if (user.password != password) return done(null, false);
      return done(null, user);
    });
  }
));

// initialise passport and session
app.use(passport.initialize());
app.use(passport.session());

// helper function to check user is logged in
function isLoggedIn(req, res, next){
  if( req.user && req.user.id ){
    next();
  } else {
    res.redirect('/login');
  }
}

app.get('/', function(req, res){
  res.render('index', {});
});

app.get('/login', function(req, res){
  res.render('login', {});
})

app.get('/register', function(req, res){
  res.render('register', {});
});

app.post('/register', function(req, res){
  const { username, password } = req.body;
  db.one(`INSERT INTO customer (username, password)
          VALUES ($1, $2)
          RETURNING id`,
          [username, password])
    .then(function(result){
      res.status(201).json({id: result.id});
    })
    .catch(function( error ){
      res.status(500).end();
    })
});

// route to accept logins
app.post('/login', passport.authenticate('local', { session: true }), function(req, res) {
  res.status(200).end();
});

// route to display user info
app.get('/profile', isLoggedIn, function(req, res){
  // send user info. It should strip password at this stage
  res.render('profile', {user:req.user});
});

app.get('/logout', function(req, res){
  // send user info. It should strip password at this stage
  req.logout();
  res.redirect('/');
});

app.listen(8080, function() { // Set app to listen for requests on port 3000
  console.log('Listening on port 8080!'); // Output message to indicate server is listening
});
