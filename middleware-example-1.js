const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(function(req, res, next){
  req.date = new Date();
  next();
});

app.get('/', function(req, res){
  console.log(req.date);
  res.send('hello');
});

app.listen(8080, function() {
  console.log('Listening on port 8080!');
});
