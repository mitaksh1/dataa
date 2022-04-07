//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require("mongoose-findorcreate");


const app = express();



app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs")

app.use(session({
    secret: "This is a not a secret.",
    resave: false,
    saveUninitialized: false    
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
    username: String,
    password: String,
    googleId: String,
    facebookId: String,
    Secret:String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);


const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id); 
   // where is this user.id going? Are we supposed to access this anywhere?
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/auth/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
      
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
  });
  }
));     

passport.use(new FacebookStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: "http://localhost:3000/facebook/auth/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", function(req, res){
    res.render("home");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    User.register({username : req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register")
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets")
            })
        }
    })
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", function (req, res){

    const user = new User ({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function(err){
        if(err){
        console.log(err);
        } else {
        passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets")
        });
    }
    });
});

app.get("/google/auth",
    passport.authenticate('google', {scope: ['profile']}),
);

app.get("/google/auth/secrets",
    passport.authenticate("google", {failureRedirect: "/login"}),
    function(req, res){
        res.redirect("/secrets");
    });

app.get("/facebook/auth",
    passport.authenticate('facebook'));

app.get("/facebook/auth/secrets", 
passport.authenticate('facebook',{failureRedirect: "/login"}), 
function(req, res){
    res.redirect("/secrets");
});

app.get("/secrets", function(req, res){
        User.find({Secret : {$ne : null}}, function(err, foundR){
            res.render("secrets", {foundRs: foundR});
        });



});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})

app.get("/submit", function(req, res){
    if(req.isAuthenticated()){
        res.render("submit");
    } else {
        res.redirect("/login");
    }
});

app.post("/submit", function(req, res){
    const submittedSecret = req.body.secret;
    User.findById(req.user._id, function(err, foundUser){
        if(!err)
        foundUser.Secret = submittedSecret;
        foundUser.save(function(err){
            if(!err)
            res.redirect("/secrets")
        });
    });
    
});

app.get("/test", function(req, res){

})

app.listen("3000", function(req, res){
    console.log("Server running on port 3000.");
});