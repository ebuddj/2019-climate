import React, {Component} from 'react'
import style from './../styles/styles.less';

// https://underscorejs.org/
import _ from 'underscore';

// https://alligator.io/react/axios-react/
import axios from 'axios';

import Heading from './Heading.jsx';
import Vis from './Vis.jsx';

class App extends Component {
  constructor() {
    super();
    
    this.state = {
      data:[],
      eu28_co2_total:0,
      data_fetched:false,
      options:[]
    }
  }
  componentDidMount() {
    let self = this;
    axios.get('./data/data.json', {
    })
    .then(function (response) {
      const countryFilter = [
        'Norway',
        'Serbia',
        'Switzerland',
        'Iceland',
        'Turkey'
      ];
      countryFilter.forEach(value => {
        delete response.data[value]
      });
      self.setState((state, props) => ({
        data:response.data,
        data_fetched:true,
        eu28_co2_total:response.data.EU28.Total[2017],
        options:_.map(_.keys(response.data), (el) => {
          return {
            'label':el,
            'title':el,
            'value':el
          };
        })
      }));
    })
    .catch(function (error) {
    })
    .then(function () {
    });
  }
  render() {
    return (
      <figure className={style.app}>
        <div className={style.content}>
          <Heading />
          <Vis data={this.state.data} options={this.state.options} data_fetched={this.state.data_fetched} eu28_co2_total={this.state.eu28_co2_total} />
        </div>
      </figure>
    );
  }
}

export default App;