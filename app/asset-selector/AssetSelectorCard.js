import React from 'react';
import AssetSelectorList from './AssetSelectorList';
import { MarketSelector, InputGroup } from '../_common';
import LiveData from '../_data/LiveData';

const AssetSelectorCard = ({actions, assets, assetSelector, history, workspace}) => {
	const showOnlyTickTradable = !!~window.location.search.indexOf('tick');
	const shownAssets = assetSelector.get('shownAssets');
	const searchableAssets = assets.get('list').filter(x =>
		!showOnlyTickTradable ||
		x.get('market_display_name') === 'Forex' ||
		x.get('market_display_name') === 'Randoms'
	);

	const onSelect = (asset) => {
		actions.workspaceAssetSelect(asset);
		if (~window.location.search.indexOf('goback')) history.goBack();
		if (~window.location.search.indexOf('tick')) {
			const liveData = new LiveData();
			liveData.api.getTickHistory(asset, { end: 'latest', count: 20 });
			liveData.api.subscribeToTick(asset);
		}
	};
	const onFavor = asset => actions.workspaceFavorAsset(asset);
	const onSearchQueryChange = e => actions.updateAssetSelectorSearchQuery(searchableAssets, e.target.value);
	const onSubmarketChange = e => actions.updateAssetSelectorSubmarket(searchableAssets, e);

	return (
		<div>
			<MarketSelector
				onChange={onSubmarketChange}
				showAllOption={true}
				showMarkets={showOnlyTickTradable ? ['Forex', 'Randoms'] : null} />
			<InputGroup
				className="asset-search"
				type="search"
				placeholder="Search for assets"
				onChange={onSearchQueryChange} />
			<AssetSelectorList
				assets={shownAssets}
				favorites={workspace.get('favoriteAssets')}
				onSelect={onSelect}
				onFavor={onFavor} />
		</div>
	);
};

AssetSelectorCard.propTypes = {
	actions: React.PropTypes.object.isRequired,
    assets: React.PropTypes.object.isRequired,
	assetSelector: React.PropTypes.object.isRequired,
	workspace: React.PropTypes.object.isRequired,
};

export default AssetSelectorCard;
