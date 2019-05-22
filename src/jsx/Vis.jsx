import React, {Component} from 'react'
import style from './../styles/styles.less';

// https://underscorejs.org/
import _ from 'underscore';

// https://www.npmjs.com/package/react-dropdown-select
import ReactSelect from 'react-dropdown-select';

// https://github.com/s-yadav/react-number-format
import NumberFormat from 'react-number-format';

import LineChartElement from './LineChartElement.jsx';
import BarChartElement from './BarChartElement.jsx';
import CountUpElement from './CountUpElement.jsx';

class Vis extends Component {
  constructor() {
    super();
    this.initialUpdateDone = false;
    this.defaultCountry = 'Germany';
    this.defaultGas = 'co2';
    this.gasses = {
      'co2':{
        'label':'CO2',
        'value':'co2'
      },
      'methane':{
        'label':'methane',
        'value':'Methane'
      },
      'nitrous-oxaine':{
        'label':'nitrous-oxaine',
        'value':'Nitrous Oxaine'
      }
    }
    this.state = {
      category:{
        top_name:'',
        top_share_name:'',
        top_share_value:0,
        top_value:0
      },
      emission_start:0,
      emission_value:0,
      emissions_per_country:[],
      emissions_yearly:[],
      selected_country:[{'label':this.defaultCountry ,'title':this.defaultCountry ,'value':this.defaultCountry }],
      selected_gas:'co2'
    }
  }
  componentDidUpdate() {
    if (this.props.data_fetched === true && this.initialUpdateDone === false) {
      this.initialUpdateDone = true;
      this.printData(this.defaultCountry, this.defaultGas);
    }
  }
  handleCountryChange(selectedOption) {
    this.setState((state, props) => ({
      selected_country:selectedOption
    }));
    if (this.props.data_fetched === true) {
      this.printData(selectedOption[0].value, this.state.selected_gas);
    }
  }
  handleGasChange(event) {
    let value = event.target.value;
    this.setState((state, props) => ({
      selected_gas:value
    }));
    if (this.props.data_fetched === true) {
      this.printData(this.state.selected_country[0].value, value);
    }
  }
  getCountryData(selected_data, selected_gas) {
    let country_data = _.filter(_.map(selected_data, (values, category) => {
      return {
        category:category,
        share:(values[2017] / this.props.data[selected_gas].EU28[category][2017]),
        value:values[2017]
      };
    }), (data) => { return data.category !== 'Total'; });
    return {
      emissions_yearly:_.map((_.filter(selected_data, (values, category) => { return category === 'Total'; })[0]), (value, year) => { return { name:year,y:value } }),
      top_name:_.sortBy(country_data, (country_share) => { return -country_share.value;})[0].category,
      top_share_name:_.sortBy(country_data, (country_share) => { return -country_share.share;})[0].category,
      top_share_value:_.sortBy(country_data, (country_share) => { return -country_share.share;})[0].share,
      top_value:_.sortBy(country_data, (country_share) => { return -country_share.value;})[0].value
    };
  }
  printData(selected_country, selected_gas) {
    let country_data = this.getCountryData(this.props.data[selected_gas][selected_country], selected_gas);
    this.setState((state, props) => ({
      category:{
        top_name:country_data.top_name,
        top_share_name:country_data.top_share_name,
        top_share_value:country_data.top_share_value,
        top_value:country_data.top_value
      },
      emissions_per_country:_.map(Object.keys(this.props.data[selected_gas]).reduce((object, key) => { if (key !== 'EU28') { object[key] = this.props.data[selected_gas][key] } return object }, {}), (values, country) => { return { name:country,x:values.Total[2017] } }),
      emission_start:state.emission_value,
      emission_value:this.props.data[selected_gas][selected_country].Total[2017],
      emissions_yearly:country_data.emissions_yearly
    }));
  }
  render() {
    let eu28_total = (this.props.data[this.state.selected_gas]) ? this.props.data[this.state.selected_gas].EU28.Total[2017] : -1;
    return (
      <div>
        <div className={style.select_container}>
          <h4>Select country</h4>
          <ReactSelect
            className={style.select_country_container}
            onChange={(value) => this.handleCountryChange(value)}
            options={this.props.options}
            values={this.state.selected_country}
          />
          <h4>Select emission type</h4>
          <div className={style.select_gas_container}>
            <button onClick={(value) => this.handleGasChange(value)} className={((this.state.selected_gas === 'co2') ? style.selected : '')} value="co2">CO2</button>
            <button onClick={(value) => this.handleGasChange(value)} className={((this.state.selected_gas === 'methane') ? style.selected : '')} value="methane">Methane</button>
            <button onClick={(value) => this.handleGasChange(value)} className={((this.state.selected_gas === 'nitrous-oxaine') ? style.selected : '')} value="nitrous-oxaine">Nitrous Oxaine</button>
          </div>
        </div>
        <div className={style.result_container}>
          <h3>{this.state.selected_country[0].value}</h3>
          <h4>This is how much {this.state.selected_gas_human} you produced in 2017</h4>
          <CountUpElement start={this.state.emission_start} end={this.state.emission_value} />
          <p>{this.state.selected_country[0].value} makes up <span className={style.value}><NumberFormat value={(this.state.emission_value / eu28_total) * 100} displayType={'text'} thousandSeparator="," suffix={' percent'} decimalScale={0}/></span> of total {this.gasses[this.state.selected_gas].label} emissions in EU28.</p>
          <h4>This is how {this.gasses[this.state.selected_gas].label} emissions have evolved from 2008 to 2017.</h4>
          <LineChartElement data={this.state.emissions_yearly} selected_gas_name={this.gasses[this.state.selected_gas].label} className={style.line_chart_container} />
          <p>Biggest output comes from <span className={style.value}>{this.state.category.top_name}</span>, total <span className={style.value}><NumberFormat value={this.state.category.top_value} displayType={'text'} thousandSeparator="," suffix={' tons'} decimalScale={0} /></span>.</p>
          <p>In relation to other countries your biggest problem is <span className={style.value}>{this.state.category.top_share_name}</span> where you make up <span className={style.value}><NumberFormat value={(this.state.category.top_share_value) * 100} displayType={'text'} thousandSeparator="," suffix={' percent'} decimalScale={0}/></span> of the emissions.</p>
          <h4>See how other countries are doing</h4>
          <BarChartElement data={this.state.emissions_per_country} selected_country={this.state.selected_country} className={style.bar_chart_container}  selected_gas_name={this.gasses[this.state.selected_gas].label} />
        </div>
      </div>
    );
  }
}

export default Vis;