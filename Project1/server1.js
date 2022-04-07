const express = require ("express");

const app = express();

const port = 3000;

app.get ("/", function(req, res) {
    res.send("<h1>Welcome to Home Page!</h1>")
});

app.get ("/contact", function(req, res){
    res.send("<h2 style='color: red;'>Contact us at: Mitaksh38@gmail.com</h2>")
});

app.get("/about-us", function (req, res){
 res.send ("<h2 style='text align:center'>Im Mitaksh Sharma</h2><br><h4 style='text align:center'>a Developer</h4>")
});

app.listen (3000, function (){
    console.log("server has started");
})