import React, { Component } from 'react';

class Weather extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<div className={this.props.className}>
				<h2>Weather Conditions</h2>
				<div id='weatherOutput' className="subcontainer"></div>
			</div>
		);
	}
}

export default Weather;