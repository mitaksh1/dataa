const express = require("express");

const app = express();

app.get("/", function(req, res){
    res.send("<h1>Hello, Another world! Part 2</h1>");
});

app.get("/contact", function (req, res){
    res.send("Contact me at: mitaksh58@gmail.com");
});

app.get("/about", function(req, res){
    res.send("Hello! <br> I'm Mitaksh Sharma,Jr Dev. <br> Currently working with: HTML, CSS, Vanilla Javascript and Node.js. ");
});

app.listen(3000, function (){
    console.log("Server has started");
});