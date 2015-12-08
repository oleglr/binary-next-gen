import React, { PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class NumberPlain extends React.Component {

	shouldComponentUpdate = shouldPureComponentUpdate;

	static propTypes = {
		currency: PropTypes.string,
		value: PropTypes.any,
		digits: PropTypes.number,
		className: PropTypes.string,
	};

	static defaultProps = {
		digits: 2,
	};

	render() {
		const { currency, className, digits } = this.props;
		const value = +this.props.value;

		if (isNaN(value)) {
			return <span />;
		}

		let formattedValue = value.toFixed(digits).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

		if (value < 0) {
			formattedValue = '(' + formattedValue.substring(1) + ')';
		}

		return (
			<span className={className}>{currency} {formattedValue}</span>
		);
	}
}
