import React, {Component} from 'react'
import style from './../styles/styles.less';

//  https://github.com/glennreyes/react-countup
import CountUp from 'react-countup';

class CountUpElement extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <CountUp
        decimal=","
        decimals={0}
        delay={0}
        duration={1}
        end={this.props.end}
        onEnd={() => {}}
        onStart={() => {}}
        prefix=""
        separator=","
        start={this.props.s}
        suffix=" tons"
        useEasing={false}
      >
        {({ countUpRef }) => (
          <div className={style.counter_container}>
            <span className={style.counter_value} ref={countUpRef} />
          </div>
        )}
      </CountUp>
    )
  }
}

export default CountUpElement;



