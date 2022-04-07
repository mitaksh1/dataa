const express= require ("express");
const mongoose = require("mongoose");
const ejs = require ("ejs");

const app = express();


app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser : true});

const blogSchema = mongoose.Schema ({
head:String,
content:String
});

const blog = mongoose.model ("blog", blogSchema);


const sampleHead = "Test Header";
const sampleText = "dsalkjansdasudihasuiodhiuasdhouiasdhoidsaho";

const test = new blog ({
head: sampleHead,
content: sampleText
});

//test.save();

app.get("/", function(req, res){
blog.find({}, function(err,results) {
if(!err){
res.render("index", {nBlog:results});
}
});
});

app.get("/compose", function(req, res){
res.render("compose");
});

app.post("/compose", function(req,res){
const title = req.body.title;
const content = req.body.content;
const newItem = new blog({
head: title,
content: content
});
newItem.save(function(err){
if(!err)
res.redirect("/");
});

});

app.get("/:blogId", function(req,res){
const Id = req.params.blogId;
blog.find({_id : Id}, function(err, result){
if(!err)
res.render("post",{nBlog:result});
});
});



app.listen(3000, function(req,res){
 console.log("Server running on port 3000");
});
