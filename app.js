//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption');
// const md5 = require('md5')
const bcrypt = require('bcrypt');

const app = express();

saltRounds = 10;

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs")

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
    username: String,
    password: String
});



const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
    res.render("home");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    
    User.findOne({username: req.body.username}, function(err,result){
        if(result){
        res.send("Email already registered.");
        console.log(result);
    
     } else{
         bcrypt.hash(req.body.password,saltRounds,function(err, hash){
             if(!err)
             var newUser = new User ({
                username: req.body.username,
                password: hash
            });
            newUser.save(function(err){
                if(err)
                console.log(err);
                else
                res.render("secrets");
            });
         })

        }
    })


});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", function (req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({username : username}, function(err, result){
        if(err){
        console.log(err);
        } else {
            bcrypt.compare(password, result.password, function(err, nResult){
                if(nResult){
                    if (nResult == true){
                        res.render("secrets");
                    }
                    else
                    res.send("Incorrrect password!");
                }
                else
                res.send("Account with this email doesnt exist");
            })

        } 
    });
});

app.get("/logout", function(req, res){
    res.redirect("/");
})

app.listen("3000", function(req, res){
    console.log("Server running on port 3000.");
});