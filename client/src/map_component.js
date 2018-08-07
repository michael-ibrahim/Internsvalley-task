import React from 'react';

class MapComponent extends React.Component {
  
	constructor(props){
    super(props);
    this.state = {
			status : 0,		//0: not yet clicked on the map, 1: clicked
      name: '',
      coordinates: [0, 0],
			markers : [null,null],
			distance: 0
    };
  }
	
  componentDidMount() {
		
		//Initializing Map
    this.map = new L.Map('mapid');
    const osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    const osm = new L.TileLayer(osmUrl, {
      minZoom: 8,
      maxZoom: 17,
      attribution,
    });
    this.map.setView(new L.LatLng(52.51, 13.40), 13);
    this.map.addLayer(osm);
				
		//Adding an Event for clicking on the map
		var this_ = this;
		this.map.on('click', function(ev) {
			var user_location = {
				lat: ev.latlng.lat,
				lng: ev.latlng.lng
			}
			this_.get_nearest_station(user_location);
		});
  }
	
	get_nearest_station(user_location){
		//API Call
    fetch('http://localhost:3000/find_nearest_station?lat='+user_location.lat+'&lng='+user_location.lng)
      .then(response => response.json())
      .then((json) => {
        this.setState({
          name: json.name,
          coordinates: [json.nearest.lat, json.nearest.lng],
					status : 1,
					distance : Math.round(json.distance * 1000).toLocaleString()
        });
				
				//clear old markers
				this.clear_old_markers();
				
				//Adding Markers for the Gas Station
				this.draw_marker(0,user_location, "You are Here!");
				this.draw_marker(1,json.nearest, "Closest Gas Station to you.<br /><small>Distance: "+Math.round(json.distance*1000)+"m</small>");
		});
	}
	
	clear_old_markers(){
		if(this.state.markers[0]){
			this.map.removeLayer(this.state.markers[0]); 
		}
		if(this.state.markers[1]){
			this.map.removeLayer(this.state.markers[1]); 
		}
	}
	
	draw_marker(i,point, text){
		//Adds a Marker for the nearest gas station
		this.state.markers[i] = L.marker([point.lat ,point.lng]).addTo(this.map)
    .bindPopup(text)
    .openPopup();
	}
	
  render() {
    return (
			<div className="container-fluid p-3 bg-light">
				<div className="row">
					<div className="col-md-4">
						{this.state.status == 1?
							(
								<div>
									<p>Nearest Gas Station:</p>
									<div className="card">
										<div className="card-body">
											<h5 className="card-title">{this.state.name}</h5>
											<h6 class="card-subtitle mb-2 text-muted">{this.state.distance} meters away!</h6>
											<p className="card-text">{this.state.coordinates[1]} , {this.state.coordinates[0]} <small>(lat,lng)</small></p>
										</div>
									</div>
									<div>
										<small>Click another location to view the nearest Gas Station</small>
									</div>
								</div>
							):
							(
								<p>Please, click your location on the map!</p>
							)
						}
					</div>
					<div className="col-md-8">
						<div id="mapid"></div>					
					</div>
				</div>
			</div>
		);
  }
};

export default MapComponent;
