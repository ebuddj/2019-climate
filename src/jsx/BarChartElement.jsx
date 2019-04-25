import React, {Component} from 'react'
import style from './../styles/styles.less';

// https://github.com/s-yadav/react-number-format
import NumberFormat from 'react-number-format';

// http://recharts.org/en-US
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip,
} from 'recharts';

class BarChartElement extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <ResponsiveContainer width="100%" height={700} className={style.bar_chart_container}>
        <BarChart data={this.props.data} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={(value) => {
            return value;
          }} />
          <YAxis type="category" dataKey="name" interval={0} width={100} />
          <Tooltip formatter={(value, name, props) => { return [<NumberFormat value={value} displayType={'text'} thousandSeparator="," suffix={''} decimalScale={0}/>, 'Tons of co2 in 2017'] }} cursor={false} />
          <Bar dataKey="x" fill="#3caea3" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    )
  }
}

export default BarChartElement;