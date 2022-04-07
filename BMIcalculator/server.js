const express = require ("express");
const bodyParser = require("body-parser");
const data = require("./data");

const app = express();

app.use(express.urlencoded({extended: true}));

app.get ("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
    const w=req.body.weight;
    const h=req.body.height;
    const BMI = parseFloat((w*(h*0.3048)),2);
    res.send(`Your BMI is: ${BMI}`);
})


app.get("/data", function(req, res) {
    res.json(data);
})


app.get("/data/search", function (req, res) {
    console.log(req.search);

})


app.listen (3000, function(){
    console.log("Server has started at port 3000");
});