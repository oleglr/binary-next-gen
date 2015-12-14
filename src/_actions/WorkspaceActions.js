import * as types from '../_constants/ActionTypes';
import * as LiveData from '../_data/LiveData';

export const workspaceViewAssetDetails = symbol => ({
    type: types.WORKSPACE_VIEW_ASSET_DETAILS,
    symbol,
});

export const workspaceAssetSelect = symbol => ({
    type: types.WORKSPACE_ASSET_SELECT,
    symbol,
});

export const changeActiveTab = (panel, index) => ({
    type: types.CHANGE_ACTIVE_TAB,
    panel,
    index,
});

export const updateTickTradeSubmarket = submarket => ({
    type: types.UPDATE_TRADING_TIMES_SUBMARKET,
    submarket,
});

export const updateTradingTimesDate = date => {
    return dispatch => {
        LiveData.api.getTradingTimes(date);
        dispatch({
            type: types.UPDATE_TRADING_TIMES_DATE,
            date,
        });
    };
};

export const updateAssetIndexSubmarket = submarket => ({
    type: types.UPDATE_ASSET_INDEX_SUBMARKET,
    submarket,
});

export const clearTradeTicks = () => ({
    type: types.CLEAR_TRADE_TICKS,
});

export const selectAssetSymbolForTrade = (newSymbol, oldSymbol) => {
    return dispatch => {
        LiveData.api.unsubscribeFromTick(oldSymbol);
        LiveData.api.subscribeToTick(newSymbol);
        dispatch(clearTradeTicks());
        dispatch(workspaceAssetSelect(newSymbol));
    };
};
