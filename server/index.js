const express = require('express')
const app = express()
const moment = require('moment');

const fuelStations = require('./fuelstations.json').features;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
	console.log("\nAPI : "+req.method + req.url);
	console.log("Time: "+ moment().format());
	next();
});

app.get('/', (req, res) => {
  res.send(fuelStations[0])
})

app.get('/find_nearest_station', (req, res) => {
  if(req.query.lat && req.query.lng){
		
		var user_location={
			lat: req.query.lat,
			lng: req.query.lng
		}
		
		var result = calculate_min_distance(user_location);
		console.log("Success");
		res.status(200).send(result);
	}
	else{
		console.log("Invalid Request: Missing lat and/or lng from query parameters!")
		res.status(400).send("Invalid Request");
	}
	
})

function calculate_min_distance(loc){
	
	var station= null;		
	var min = 99999999;
	var nearest = null;
	var name = null;
	var distance = null;
	
	
	for(var i in fuelStations){
		
		//initializing current station's location
		station = {
			lat: fuelStations[i].geometry.coordinates[1],
			lng: fuelStations[i].geometry.coordinates[0]
		} 
		
		//calculating distance
		distance = calculate_distance(station.lat, station.lng, loc.lat, loc.lng, "K");
		
		//checking if minimum
		if(distance < min)
		{
			min = distance;
			nearest = station;
			name = fuelStations[i].properties.name;
		}
	}

	return {
		nearest:nearest,
		distance: min,
		name:name
	};
}

function calculate_distance(lat1, lon1, lat2, lon2, unit) {
	/*
		Standard haversine function to calculate distance between two points
		I validated it roughly using maps.google.com
		Source: https://www.geodatasource.com/developers/javascript
	*/
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	if (dist > 1) {
		dist = 1;
	}
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}

app.listen(3000, () => console.log('App listening on port 3000'))
