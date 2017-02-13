import React, { Component } from 'react';
import * as d3 from 'd3'
import './App.css';

import { World } from './Maps'

class App extends Component {

  state = {
    data: null
  }

  componentWillMount() {
    d3.queue()
      .defer(d3.csv, 'data/UN_MigrantStockByOriginAndDestination_2015_cleaned.csv',
            (row) => {
              console.log(row)
              return row;
            })
      .await((err, data) => {
          this.setState({
            data:data
          })
      })
  }

  render() {
    console.log('here is data', this.state.data);
    return (
      <div className="App">
        
        <p className="App-intro">
          
          <World />
        </p>
      </div>
    );
  }
}

export default App;
