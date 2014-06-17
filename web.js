var express = require('express');
var app     = express();
var bodyParser = require('body-parser');
var nodemailer = require("nodemailer");
// var transport = nodemailer.createTransport("Direct", {debug: true});

var transport = nodemailer.createTransport("SMTP", {
  auth: {
    user: "michaelmoser01@gmail.com",
    pass: process.env.ENV_SMTP_PASS
  }
});

app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html');
});

app.get('/resume', function(req, res){
  res.sendfile(__dirname + '/resume.pdf');
});

app.use(bodyParser());

app.use('/js', express.static(__dirname + '/js'))
app.use('/css', express.static(__dirname + '/css'))
app.use('/fonts', express.static(__dirname + '/fonts'))
app.use('/images', express.static(__dirname + '/images'))

app.post('/api/contact', function (req, res) {
  var message = {
    from: req.body.email, 
    to: "michaelmoser01@gmail.com", 
    subject: "Resume interest from " + req.body.name, 
    html: "Name: " + req.body.name + "<br/>" + "Email: " + req.body.email + "<br/>"  + req.body.comments,
  }

  transport.sendMail(message, function(error, response){
    if(error){
        console.log('Error occured');
        console.log(error.message);
        res.end();
    }else{
        console.log(response);
        console.log('Message sent successfully!');
        res.end();
    }
  });
});

var server = app.listen(process.env.PORT || 5000, function() {
  console.log('Listening on port %d', server.address().port);
});