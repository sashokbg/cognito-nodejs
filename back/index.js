var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser')
var cognito = require('./cognito.js');

var router = express.Router();

router.get('/current-user', function(req, res) {
  let currentUser = cognito.getCurrentUser();
  res.json({message: JSON.stringify(currentUser)})
});

router.post('/user-groups', function(req, res) {
  cognito.listGroups(req.body.username)
    .then(function(data){
      res.json({message: data});
    })
    .catch(function(err){
      res.json({error: err});
    });
});

router.post('/user', function(req, res) {
  cognito.getUser(req.body.AccessToken)
    .then(function(data){
      res.json({message: data});
    })
    .catch(function(err){
      res.json({error: err});
    });
});

router.post('/login', function(req, res) {
  cognito.login(req.body.login, req.body.password)
    .then(function(data){    
      res.json({message: data});
    }).catch(function(error){
      res.json({error: error});
    });
});

router.post('/register', function(req, res){
  cognito.register(req.body.login, req.body.password, req.body.email, req.body.name, req.body.family_name)
    //.then(function(data){
    //  res.json({message: data});
    //})
    //.catch(function(error){
    //  res.json({error: error});
    //});
});

app.use(bodyParser.json());
app.use('/', router);
app.listen(port);

console.log('Started app server on port 3000');
