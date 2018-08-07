import React from "react";
import ReactDOM from "react-dom";
import MapComponent from './map_component';

const Index = () => {
  return (
		<div>
			<div>
				<div className="container-fluid p-1 bg-dark text-light"><h1>Welcome to the Awesome Module!</h1></div>
				<MapComponent />
			</div>
		</div>
	);
};

ReactDOM.render(<Index />, document.getElementById("index"));
