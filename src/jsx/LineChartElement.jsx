import React, {Component} from 'react'
import style from './../styles/styles.less';

// https://github.com/s-yadav/react-number-format
import NumberFormat from 'react-number-format';

// http://recharts.org/en-US
import {
  LineChart, Line, XAxis, ResponsiveContainer, CartesianGrid, Tooltip,
} from 'recharts';

class LineChartElement extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <ResponsiveContainer width="100%" height={200} className={style.line_chart_container}>
        <LineChart isAnimationActive={true} data={this.props.data} margin={{ top: 0, right: 5, left: 5, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval="preserveStartEnd" />
          <Tooltip formatter={(value, name, props) => { 
            return [<NumberFormat value={value} displayType={'text'} thousandSeparator="," suffix={''} decimalScale={0} />, 'Tons of co2 in ' + props.payload.name] }
          }/>/>
          <Line type="monotone" dataKey="y" stroke="#3caea3" />
        </LineChart>
      </ResponsiveContainer>
    )
  }
}

export default LineChartElement;