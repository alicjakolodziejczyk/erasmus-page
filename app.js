//jshint esversion:6
require('dotenv').config();
const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));


app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
  const firstName = req.body.name;
  //const lastName = "Unknown";
  const email = req.body.email;
  console.log(firstName, email);

  var data = {
    members : [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName
        }
      }
    ]
  };

  jsonData = JSON.stringify(data);

  const url = process.env.MY_URL;
  const options = {
    method: "POST",
    auth: process.env.MY_API
  };


  const request = https.request(url, options, function(response){
    if(response.statusCode === 200){
      console.log("Success");
      res.redirect("/");
    }else{
      console.log("Failure");
      res.redirect("/");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));

    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});


