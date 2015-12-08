import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';
import AssetIndexCard from './AssetIndexCard';

@connect(state => ({ assets: state.assets, assetIndexFilter: state.workspace.get('assetIndex') }))
export default class AsssetIndexContainer extends React.Component {

	shouldComponentUpdate = shouldPureComponentUpdate;

	static propTypes = {
		assets: PropTypes.object.isRequired,
		assetIndexFilter: PropTypes.object.isRequired,
	};

	render() {
		return (
			<AssetIndexCard {...this.props} />
		);
	}
}
