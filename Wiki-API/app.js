const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const req = require("express/lib/request");
const port = process.env.port || "3000";

const app = express();

app.set("view engine","ejs");

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/WikiDB", {useNewUrlParser: true});

const wikiSchema = mongoose.Schema ({
    title : String,
    content : String
});

const Article = mongoose.model("Article", wikiSchema);

app.route("/articles")
.get(function (req, res){
    Article.find(function(err, foundArticles){
        if(!err){
        res.send(foundArticles)
        } else {
            res.send(err);
        }
    });
})
.post(function(req, res){
    const newArticle = new Article ({
        title:req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err)
        {res.send("Successfully added");
    } else {
        res.send(err);
    }});
})
.delete(function(res, res){
    Article.deleteMany(function(err){
        if(!err)
        res.send("Successfully deleted.")
    });
});

app.route("/articles/:title")

.get(function(req, res){
    Article.findOne({title: req.params.title}, function(err, result){
        if(result)
        res.send(result);
        else
        res.send("Page not found.");
    });
})

.put(function(req, res){
    Article.replaceOne(
        {title: req.params.title},
        {title : req.body.title, 
        content: req.body.content},
        function(err){
            if(!err)
            res.send("Successfully update article");
            else
            res.send(err);
        }
    )
})

.patch(function(req, res){
    Article.updateOne(
        {title: req.params.title},
        {$set: req.body},
        function(err){
            if(!err)
            res.send("Successfully update article partially.");
        }
    )
})

.delete(function(req, res){
    Article.deleteOne({title: req.params.title}, function(err){
        if(!err)
        res.send("Successfully deleted");
    })
});




app.listen(port, function (req, res){
    console.log("Server is running on port " + port);
});