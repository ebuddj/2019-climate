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
    this.state = {
      category:{
        top_name:'',
        top_share_name:'',
        top_share_value:0,
        top_value:0
      },
      co2_per_country:[],
      co2_start:0,
      co2_value:0,
      co2_yearly:[],
      selected_value:[{'label':this.defaultCountry ,'title':this.defaultCountry ,'value':this.defaultCountry }]
    }
  }
  componentDidUpdate() {
    if (this.props.data_fetched === true && this.initialUpdateDone === false) {
      this.initialUpdateDone = true;
      this.printData(this.defaultCountry);
    }
  }
  handleChange(selectedOption) {
    this.setState((state, props) => ({
      selected_value:selectedOption
    }));
    if (this.props.data_fetched === true) {
      this.printData(selectedOption[0].value)
    }
  }
  getCountryData(selected_data) {
    let country_data = _.filter(_.map(selected_data, (values, category) => {
      return {
        category:category,
        share:(values[2017] / this.props.data.EU28[category][2017]),
        value:values[2017]
      };
    }), (data) => { return data.category !== 'Total'; });
    return {
      co2_yearly:_.map((_.filter(selected_data, (values, category) => { return category === 'Total'; })[0]), (value, year) => { return { name:year,y:value } }),
      top_name:_.sortBy(country_data, (country_share) => { return -country_share.value;})[0].category,
      top_share_name:_.sortBy(country_data, (country_share) => { return -country_share.share;})[0].category,
      top_share_value:_.sortBy(country_data, (country_share) => { return -country_share.share;})[0].share,
      top_value:_.sortBy(country_data, (country_share) => { return -country_share.value;})[0].value
    };
  }
  printData(selected_value) {
    let country_data = this.getCountryData(this.props.data[selected_value]);
    this.setState((state, props) => ({
      category:{
        top_name:country_data.top_name,
        top_share_name:country_data.top_share_name,
        top_share_value:country_data.top_share_value,
        top_value:country_data.top_value
      },
      co2_per_country:_.map(Object.keys(this.props.data).reduce((object, key) => { if (key !== 'EU28') { object[key] = this.props.data[key] } return object }, {}), (values, country) => { return { name:country,x:values.Total[2017] } }),
      co2_start:state.co2_value,
      co2_value:this.props.data[selected_value].Total[2017],
      co2_yearly:country_data.co2_yearly
    }));
  }
  render() {
    return (
      <div>
        <ReactSelect
          className={style.select_container}
          onChange={(value) => this.handleChange(value)}
          options={this.props.options}
          values={this.state.selected_value}
        />
        <div className={style.result_container}>
          <h3>{this.state.selected_value[0].value}</h3>
          <h4>This is how much CO2 you produced in 2017</h4>
          <CountUpElement start={this.state.co2_start} end={this.state.co2_value} />
          <p>{this.state.selected_value[0].value} makes up <span className={style.value}><NumberFormat value={(this.state.co2_value / this.props.eu28_co2_total) * 100} displayType={'text'} thousandSeparator="," suffix={' percent'} decimalScale={0}/></span> of total co2 emissions in EU28.</p>
          <h4>This is how your emissions have evolved from 2008 to 2017.</h4>
          <LineChartElement data={this.state.co2_yearly} className={style.line_chart_container} />
          <p>Biggest output comes from <span className={style.value}>{this.state.category.top_name}</span>, total <span className={style.value}><NumberFormat value={this.state.category.top_value} displayType={'text'} thousandSeparator="," suffix={' tons'} decimalScale={0}/></span>.</p>
          <p>In relation to other countries your biggest problem is <span className={style.value}>{this.state.category.top_share_name}</span> where you make up <span className={style.value}><NumberFormat value={(this.state.category.top_share_value) * 100} displayType={'text'} thousandSeparator="," suffix={' percent'} decimalScale={0}/></span> of the emissions.</p>
          <h4>See how other countries are doing</h4>
          <BarChartElement data={this.state.co2_per_country} selected_value={this.state.selected_value} className={style.bar_chart_container} />
        </div>
      </div>
    );
  }
}

export default Vis;