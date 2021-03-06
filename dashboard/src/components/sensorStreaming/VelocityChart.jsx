import React from 'react';
import c3 from 'c3';

class VelocityChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			x: ['x'],
			y: ['y']
		};
	}

	renderChart() {
		c3.generate({
			bindto: '#velocityChart',
			data: {
				columns: [this.state.x, this.state.y],
				type: 'scatter',
				labels: true
			},
			point: { show: true },
			axis: {
				y: {
					max: Math.max(Math.max(this.state.x), Math.max(this.state.y)) + 10,
					min: Math.min(Math.min(this.state.x), Math.min(this.state.y)) - 10
				},
				x: { show: true }
			}
		});
	}

	componentDidMount() {
		const { sensorControl } = this.props;
		// The each sensor we'd like to stream must be enabled and we must let the system know what to do once it is. In this case (for each of the sensors we'll be plotting), we add each new value from the stream to an array, which is subsequently plotted against time.
		sensorControl.enableSensor(sensorControl.velocity, data => {
			this.setState({
				x: this.state.x.concat(data.X),
				y: this.state.y.concat(data.Y)
			}, this.renderChart());
		});
	}

	render() {
		return (
			<div>
				<div id='velocityChart'></div>
			</div>
		);
	}
}

export default VelocityChart;
