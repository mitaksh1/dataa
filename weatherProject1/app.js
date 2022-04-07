const express = require ("express");
const https = require ("https");

const app = express();

app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html")
});

app.post ("/", function (req, res){
    const query = req.body.cityName;  
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=db8b8a9c68bc59909ab4ad76cf4ec51d&units=metric";
    https.get(url, function (response){
        console.log(response.statusCode);

    response.on("data", function(data){
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].main;
        const icon = weatherData.weather[0].icon;

        res.write("<style>body{background-color: pink;}</style>")
        res.write("<p> The weather is currently " + weatherDesc	ription + "</p>");
        res.write("<h1>Temperature in" + query + " is " + temp + " degree celcius.</h1>");
        res.write("<img src = 'https://openweathermap.org/img/wn/" + icon + ".png'>");
        res.send();

    });
    });


});

app.listen (3000, function (){
    console.log("Server is running on port 3000.")
});