'use strict'

//Load enviroment Variable
require('dotenv').config();

//use application depend
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

// Server setup

const PORT = process.env.PORT || 3000;
const app = express();
//giving permission to connect with the server
app.use(cors());

// Server Routes
app.get('/', (req, res) => {
    res.status(200).json('Home Page');
})
// Route  Definition
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);

// Route Handlers
function locationHandler(req, res) {
    const city = req.query.city;
    // Request data (server is acting as client)
    superagent(`https://eu1.locationiq.com/v1/search.php?key=${process.env.Location_API_KEY}&q=${city}&format=json`)
    .then( response=>{
        // console.log(response);
        const locationDataFromAPI = response.body;
        const locationObject = new Location(city, locationDataFromAPI);
        res.status(200).json(locationObject);
                
    })
    .catch((error) =>{ errorHandler(error, req, res)});
};

function weatherHandler(req, res){
const city = req.query.city;
    superagent(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city/**or we can use request.query.search_query */}&key=${process.env.WEATHER_API_KEY}`)
    .then((apiResponse)=>{
        // console.log(apiResponse);
       
      let weatherData=  apiResponse.body.data.map((value)=>{
        //   console.log(value);
          
       return new Weather(value);
      })
       
        res.status(200).json(weatherData);
    })
}


function Location(city, locationDataFromAPI){
    this.city = city;
    this.formatted_query = locationDataFromAPI[0].display_name;
    this.latitude = locationDataFromAPI[0].lat;
    this.longitude = locationDataFromAPI[0].lon;
};

function Weather (value){
    this.forecast = value.weather.description;
    this.time = new Date(value.datetime).toDateString();
}


function errorHandler(error, req, res){
    res.status(500).send(error);
}

// server listen 
app.listen(PORT, console.log(`hey app woke up on ${PORT} PORT`));

