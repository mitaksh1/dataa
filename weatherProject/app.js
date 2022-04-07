const express = require ("express");
const https = require("https");

const app = express ();

app.get ("/", function (req, res){
    var url = "https://api.openweathermap.org/data/2.5/weather?q=London&appid=db8b8a9c68bc59909ab4ad76cf4ec51d&units=metric";
    https.get(url, function(response){
        console.log(response.statusCode);
        response.on ("data", function(data){
            const weatherData = JSON.parse(data);
            const weatherTemp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            console.log(description);
        });
        
    });
    res.send("Hello world!");
});

app.listen(3000, function (){
    console.log("Server is running at port 3000")
})

