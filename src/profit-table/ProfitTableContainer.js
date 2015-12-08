import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ProfitTableCard from './ProfitTableCard';

@connect(state => ({ profitTable: state.profitTable }))
export default class ProfitTablePage extends React.Component {

	static propTypes = {
		profitTable: PropTypes.object,
		dispatch: PropTypes.func,
	};

	render() {
		return <ProfitTableCard {...this.props} />;
	}
}
