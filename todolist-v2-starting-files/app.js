//jshint esversion:6

const express = require("express");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser : true});

const itemsSchema = mongoose.Schema({
  name: String
});

const newListSchema = mongoose.Schema ({
  headMain: String,
  content : [itemsSchema]
});

const Item = mongoose.model("Item",itemsSchema);

const newItem = mongoose.model ("NewItem", newListSchema);

const item1 = new Item ({
  name: "Welcome to To Do List."
}); 

const item2 = new Item ({
  name: "You can add more task from below"
}); 

const item3 = new Item ({
  name: "And delete these using"
}); 

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {
  


  Item.find({},function(err,results){

      if(results.length ==0) {
        {
          Item.insertMany(defaultItems, function(err){
            if (err){
              console.log(err);
            } else {
              console.log("Successfully inserted many.")
            }
          });
        }
        res.redirect("/");
      } else {
        res.render("list", {listTitle: "Today", newListItems: results});
      }    
  });

});

app.post("/", function(req, res){

  const item = req.body.newItem;
  const reqList = req.body.list;
  const currItem = new Item({
    name: item
  });

  if (reqList == "Today"){

      currItem.save(function(err){
        if(err){
          console.log(err);
        } else {
          res.redirect("/");
        }
      });
    } else {
      newItem.findOne({headMain : reqList}, function(err,result){
          result.content.push(currItem);
          result.save(function(err){
            if (!err){
              res.redirect("/" + reqList);
            }
          });
      });
      
  
    }
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const pageTitle = req.body.pgTitle;

  if (pageTitle == "Today") {
  Item.findByIdAndRemove(checkedItemId, function (err){
    if(!err){
      res.redirect("/");
    } 
  })
} else {
  newItem.findOneAndUpdate(
    {headMain : pageTitle},
    {$pull: {content: {_id: checkedItemId}}},
    function(err,result) {
    if (!err){
      res.redirect("/" + pageTitle);
    }
  });
}


}); 

app.get("/:lHead", function(req, res){
  const defHead = req.params.lHead;
  const listHead = defHead.charAt(0).toUpperCase() + defHead.slice(1).toLowerCase();
  newItem.findOne({headMain : listHead}, function(err,result){
    if (result){
      res.render("list", {listTitle:result.headMain, newListItems: result.content});
    }else {
      const list = new newItem ({
        headMain : listHead,
        content : defaultItems
      });
      list.save();
      res.redirect("/" + listHead);
    }
  })
  
});




app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
