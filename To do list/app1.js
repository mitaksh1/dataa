
const express = require ("express");
const port = process.env.PORT || 3000;
const date = require (__dirname + "/date.js");


const app = express();

app.use (express.urlencoded({extended: true}));
app.use(express.static("public"));
var items = ["Task 1", "Task 2", "Task 3"]; 
var workItems = [];

app.set('view engine', 'ejs');


app.get ("/", function(req, res){


    let data = date.getDate();
    res.render('list', {pageTitle : data, newItems: items});

});

app.post ("/", function(req, res){
    var item = req.body.Task;
    if (req.body.button === "Work"){
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
    

})

app.get ("/work", function(req, res){
    res.render("list", ({pageTitle: "Work List", newItems: workItems}))
});

app.post("/work", function(req, res){
    var item = req.body.Task;
    workItems.push(item);
    res.redirect("/work");
});

app.get ("/about", function(req, res){
    res.render("about");
});


app.listen(3000, function(){
    console.log("Server running at port " + port)
});