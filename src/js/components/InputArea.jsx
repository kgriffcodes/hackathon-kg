import React, { Component } from 'react';

class InputArea extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<div className="subcontainer d-flex flex-column">
				<label htmlFor='userOrigin'>Home Address</label>
				<input className='inputBox' type='text' id='userOrigin' placeholder='Enter your home address here...' />
				<label className='mt-2' htmlFor='userDestination'>Work Address</label>
				<input className='inputBox' type='text' id='userDestination' placeholder='Enter your work address here...' />
				<button onClick = { this.props.calcRoute } className="btn btn-primary mt-3"><i className="fas fa-directions"></i>  Show Me My Commute</button>
			</div>
		);
	}
}

export default InputArea;