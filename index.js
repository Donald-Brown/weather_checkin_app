// require express for server use
const { response } = require("express");
// require nedb for database use
const Datastore = require("nedb");
// require node-fetch to use fetch
const fetch = require("node-fetch");
// require dotenv
require('dotenv').config();
// console.log(process.env);

// build server
const express = require("express");
const myServer = express();
const port = 3000;

//build database
const database = new Datastore("database.db");
database.loadDatabase();
// test inserting to database
// database.insert({ name: 'Brown', status: 'here' });

// set server port and listener
myServer.listen(port, () => console.log(`listening on port ${port}`));

// set static directory for serving a file index in this case
myServer.use(express.static("public"));
// set option to parse json and a limit of 1mb
myServer.use(express.json({ limit: "1mb" }));

// GET method route
myServer.get("/api", (req, res) => {
  // find info in database and send as response
  database.find({}, (err, data) => {
    if (err) {
      res.end();
      return;
    } else {
      res.json(data);
    }
  });
});

// POST method route
myServer.post("/api", (req, res) => {
  // get data from request and file in data base
  const data = req.body;
  database.insert(data);

  // return to the requester
  res.json(data);
  // res.json({
  //   status: 'success',
  //   timestamp: data.timestamp,
  //   weather: data.weather,
  //   latitude: data.lat,
  //   longitude: data.lon
  // });
});

// GET method for weather
// use colon to add route parameters
// const api_key = 'api key'; // moved to dotenv file
const api_key = process.env.API_KEY;
myServer.get("/weather/:latlon", async (req, res) => {
  const latlon = req.params.latlon.split(",");
  lat = latlon[0];
  lon = latlon[1];
  //get weather data
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${api_key}`;
  // need to install node-fetch to use fetch
  const weather_response = await fetch(weatherURL);
  const weatherJSON = await weather_response.json();

  const airQuailityURL = `https://docs.openaq.org/v2/latest?limit=100&page=1&offset=0&sort=desc&coordinates=${lat}%2C${lon}&radius=5000&order_by=lastUpdated&dumpRaw=false`;
  const airQualityResponse = await fetch(airQuailityURL);
  const airQuailityJSON = await airQualityResponse.json();

  const data = {
    weather: weatherJSON,
    airQuality: airQuailityJSON,
  };

  res.json(data);
});
