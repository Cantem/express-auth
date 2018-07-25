const express = require('express');
const bodyParser = require('body-parser');
const app = express();

function daveOnly(req, res, next){
  if(req.query.name === 'dave') {
    next();
  } else {
    res.send('Sorry, you are not dave');
  }
};

app.get('/', daveOnly, function(req, res){
  res.send('hello');
});

app.listen(8080, function() {
  console.log('Listening on port 8080!');
});
