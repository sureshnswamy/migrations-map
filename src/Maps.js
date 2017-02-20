import React, { Component } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import _ from 'lodash'


const Map = ({ topology, projection }) => {
     const D = d3.geoPath(projection),
          countries = topojson.feature(topology, topology.objects.countries);
 
     return (
        <g>
            {countries.features.map((country, i) => (
                <path d={D(country)}
                      key={`${country.id}-${i}`}
                      style={{stroke: 'white',
                             strokeWidth: '0.25px',
                             fill: 'grey'}} />
             ))}
        </g>
     );
 };

 const Curve = ({ start, end}) => {
			const line = d3.line()
										 .curve(d3.curveBasis),
				[x1,y1] = start,
				[x2,y2] = end,
				middle = [(x1+x2)/2, (y1+y2)/2-200]

			return (
			<path d={line([start, middle, end])}
						style ={{stroke: 'black',
						strokeWidth: '0.5px',
						fillOpacity: 0 }} />
			)

 }

const CountryMigrations = ({ data, nameIdMap, centroids }) => {
     const line = d3.line()
                   .curve(d3.curveBasis),
           destination = centroids[data.id];
 
     /*console.log(data.name);*/
 
     const sources =  Object.keys(data.sources)
                            .filter(name => centroids[nameIdMap[name]])
                            .map(name => centroids[nameIdMap[name]]);
     return (
         <g>
             {sources.map((source, i) => (
                 <Curve start={source} end={destination}
                 		    key={`${data.id}-${i}`} />
              ))}
         </g>
     )
 };


const Migrations =({topology, projection, data, nameIdMap}) => {
		const countries = topojson.feature(topology, topology.objects.countries),
					path = d3.geoPath(projection),
					centroids = _.fromPairs(countries.features
																					 .map(country => [country.id, 
																					 									path.centroid(country)]))
		return (

				<g> 
						<CountryMigrations data={data[240]} nameIdMap={nameIdMap}
																			centroids={centroids} />

				</g>
		)
}


class World extends Component {
	
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
					<Migrations topology={topology} projection={this.projection}
											data={this.props.data} nameIdMap={this.props.nameIdMap} />
				</svg>
			)
		}

}

export {World};