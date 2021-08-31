import React, { Component } from 'react';
import Weather from './components/Weather';
import Traffic from './components/Traffic';
import InputArea from './components/InputArea';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mapState: '',
			origin: '',
			destination: '',
			userZip: 0
		};
		this.fetchWeatherData = this.fetchWeatherData.bind(this);
		this.initMap = this.initMap.bind(this);
		this.renderMap = this.renderMap.bind(this);
		this.calcRoute = this.calcRoute.bind(this);
	}

	componentDidMount(){
		this.renderMap();
	}

	renderMap = () => {
		const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
		loadScript(`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initMap&libraries=places&v=weekly`);
		window.initMap = this.initMap;
	}

	initMap(){
		//set map options to initially center Chicago
		var options = {
			zoom: 8,
			center: {lat:41.8781, lng:-87.6298},
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}

		//initialize map
		var map = new window.google.maps.Map(document.getElementById('map'), options);

		//add map to state for later usage
		this.setState({
			mapState: map
		});

		const autocompleteOptions = {
			types: ['address'],
			componentRestrictions: {'country': ['us']},
			fields: ['address_components', 'place_id', 'geometry', 'name']
		}

		//set autocomplete on user origin input area
		const autocomplete = new google.maps.places.Autocomplete(document.getElementById('userOrigin'), autocompleteOptions);
			  
		//set autocomplete on user destination input area
		const autocomplete2 = new google.maps.places.Autocomplete(document.getElementById('userDestination'), autocompleteOptions);
		
		// const originAddress = autocomplete.getPlace();
		// const destinationAddress = autocomplete2.getPlace();

		//grab the zipcode of the user's workplace and call fetchWeatherData using that zipcode
		autocomplete2.addListener('place_changed', () => {
			const userDestPlace = autocomplete2.getPlace();
			const zipCode = userDestPlace.address_components[7].long_name;
			// console.log('zipcode:', zipCode);
			this.fetchWeatherData(zipCode);
		});
	};
	
	//function to calculate the route from user start to end point
	calcRoute() {
		
		var map = this.state.mapState;
		
		//create a Directions service object to use the route method and get a result for our request
		var directionsService = new google.maps.DirectionsService();
		
		//create a DirectionsDisplay object which we will use to display the root
		var directionsDisplay = new google.maps.DirectionsRenderer(); 
		
		//bind the directionsRenderer to the map
		directionsDisplay.setMap(map);
		
		
		//create a directions request for driving in imperial units
		var request = {
			origin: document.getElementById('userOrigin').value,
			destination: document.getElementById('userDestination').value,
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.IMPERIAL
		}
		//pass the request to the route method
		directionsService.route(request, (result, status) => {
			if (status == 'OK') {
				//get distance and time
				const output = document.querySelector('#trafficText');
				const tripDuration = result.routes[0].legs[0].duration.text;
				const tripDistance = result.routes[0].legs[0].distance.text;
				
				output.innerHTML = `<p>Here is your route for the day! Traveling from ${document.getElementById('userOrigin').value} to ${document.getElementById('userDestination').value}. If you leave now, it should take you approximately <strong>${tripDuration}</strong> minutes to travel <strong>${tripDistance}</strong>.</p>`
				
				//display route
				directionsDisplay.setDirections(result);
			} else {
				//delete route from map
				directionsDisplay.setDirections({ routes: []});
				
				//center map in Chicago
				map.setCenter({lat:41.8781, lng:-87.6298});
				
				//show error message
				output.innerHTML = "<div className='alert-danger'><i className='fas fa-exclamation-triangle'></i> Could not retrieve driving directions between these two points.</div>"
			}
		});
	}

	fetchWeatherData(userZip){
		const weatherApiKey = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
		const url = `https://api.openweathermap.org/data/2.5/weather?zip=${userZip},us&units=imperial&appid=${weatherApiKey}`;
		const weatherOutput = document.getElementById('weatherOutput');
		fetch(url)
			.then(res => res.json())
			.then(data => {
				
				//grab the necessary data from the openWeatherMap API request
				const weatherDescription = data.weather[0].description;
				const tempHigh = data.main.temp_max;
				const tempLow = data.main.temp_min;
				const feelsLike = data.main.feels_like;


				weatherOutput.innerHTML = `<p>There will be ${weatherDescription} today, with a high of ${tempHigh}<span>&#176;</span>F and a low of ${tempLow}<span>&#176;</span>F. It currently feels like ${feelsLike}<span>&#176;</span>F.</p>`

			})
			.catch((error) => {
				console.log(error)
			});
	}

	render(){
		return (
			<div className="container">
				<div className="d-flex flex-column">
					<div className="pt-4 col-md-8 mx-auto">
						<h1 className="text-center">Check out your Morning Commute</h1>
						<InputArea fetchWeatherData={ this.fetchWeatherData } calcRoute={ this.calcRoute } />
					</div>
					<div className="mt-3 mx-auto col-md-10 resultsContainer">
						<Weather className="mt-2" />
						<Traffic className="mt-2 mb-4" />
					</div>
				</div>
			</div>
		);
	}
}

// create a function outside of react component in order to add google maps script tag in react
function loadScript(url){
	var index = window.document.getElementsByTagName('script')[0];
	var script = window.document.createElement('script');
	script.src = url;
	script.async = true;
	script.defer = true;
	index.parentNode.insertBefore(script, index);
}

export default App;