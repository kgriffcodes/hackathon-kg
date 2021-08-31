import React, { Component } from 'react';

class Traffic extends Component {
	constructor(props){
		super(props);
	}

	fetchTrafficData(){
		const url = ``;
		fetch(url)
			.then(response => response.json())
			.then(data => console.log(data))
			.catch((error) => {
				console.log(error)
			});
	}	

	render(){
		return (
			<div className={this.props.className}>
				<h2>Traffic Conditions</h2>
				<div className="subcontainer d-flex flex-column justify-content-around align-items-center">
					<div id="map"></div>
					<div id='output'>
						<p className="mx-auto pt-3" id="trafficText"></p>
					</div>
				</div>
			</div>
		);
	}
}

export default Traffic;