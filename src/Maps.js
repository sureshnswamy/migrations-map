import React, { Component } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

const Map = ({topology, projection}) => {
	const D = d3.geoPath(projection),  
				countries = topojson.feature(topology, topology.objects.countries)
				/*console.log(topojson.feature);*/
	
	return  (
			<g>
					{countries.features.map( country => (
						<path d={D(country)} />
					))}
			</g>
	);
	
};

class World extends Component {
	static defaultProps = {width:800, height:800};

	state = {
		topology: null
	}
		
		projection = d3.geoEquirectangular()
										
										

		componentWillMount() {
				d3.json ('data/world-110m.v1.json',
								(err, topology) => {
									this.setState ({
										topology: topology
									});
							
								});

		}

		render () {
			

			const { width, height} = this.props,
						{ topology} = this.state;

			if (!topology) {
				return null;
			}

			return (
				<svg width={width} height={height}>
					<Map topology={topology} projection={this.projection} />
				</svg>
			)
		}

}

export {World};