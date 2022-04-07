const express = require ("express");
const bodyParser = require ("body-parser");

const app = express();

// body parser code 
app.use (express.urlencoded({extended: true}));

app.get ("/", function (req, res){
    res.sendFile (__dirname + "/index.html");
});

app.post ("/", function(req, res){
    
    var num1 = Number(req.body.Num1);
    var num2 = Number(req.body.Num2);
    var result = num1+num2;
    res.send("Your answer is: " + result);

});

app.get ("/BMIcalculator", function (req, res){
    res.sendFile (__dirname + "/BMIcalculator.html");
});

app.post ("/BMIcalculator", function (req, res){
    var weight = Number(req.body.weight);
    var height = Number(req.body.height);
    var result = (weight/(Math.pow(height,2))).toFixed(2);
    res.send("Your BMI is: " + result);

});



app.listen (3000, function (){
    console.log("Server is running on port 3000.");
})