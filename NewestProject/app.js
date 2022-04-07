const ejs = require("ejs");
const mongoose = require("mongoose");
const express = require("express");

const app = express();

//parse,ejs, public

app.set("view engine", "ejs");
app.use(express.static( "public"));
app.use(express.urlencoded({extended: true}));

//connecting and setting up mongodb
mongoose.connect("mongodb://localhost:27017/blogPosts");

const blogSchema = new mongoose.Schema ({
title: String,
body: String,
image: String
});

const Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
Blog.find({}, function(err, results){
if(err){
console.log(err);
} else {
res.render("home", {results: results});
}
});
});

app.get("/news", function(req,res){
res.render("news");
});

app.get("/about", function(req,res){
res.render("about");
});

app.get("/contact", function(req, res){
res.render("contact");
});

app.get("/compose", function(req, res){
res.render("compose");
});

app.post("/compose", function(req, res){
const Title = req.body.title;
const Body = req.body.blog;
const imageName = req.body.imageName;

const newBlog = new Blog ({
title: Title,
body: Body,
image: imageName
});
newBlog.save(function(err){
if (err)
console.log(err);
else
res.redirect("/");
})
})

app.get("/:nice", function(req, res){
const a  = req.params.nice;
res.render("error");
})



app.listen("3000", function(req, res){
console.log("Server running on port 3000");
});








