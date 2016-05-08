import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import isIntraday from 'binary-utils/lib/isIntraday';
import isDurationLessThan2Mins from 'binary-utils/lib/isDurationLessThan2Mins';
import askPriceFromProposal from 'binary-utils/lib/askPriceFromProposal';
import ErrorMsg from '../_common/ErrorMsg';

import BarrierCard from '../barrier-picker/BarrierCard';
import SpreadBarrierCard from '../barrier-picker/SpreadBarrierCard';
import DigitBarrierCard from '../barrier-picker/DigitBarrierCard';
import DurationCard from '../duration-picker/DurationCard';
import StakeCard from '../payout-picker/StakeCard';
import PayoutCard from '../payout-picker/PayoutCard';
import BuyButton from '../tick-trade/BuyButton';
import TradeTypeDropDown from '../trade-type-picker/TradeTypeDropDown';
import AssetPickerDropDown from '../asset-picker/AssetPickerDropDown';

import * as LiveData from '../_data/LiveData';

import * as updateHelpers from './TradeParamsCascadingUpdates';

/**
 * This UI is coded with a few assumptions, which should always be true, this comments serves as a future reference
 * purpose.
 *
 * 1. Tick trade will not have barrier, unless it's a digit trade, reason is that the duration is too short.
 * 2. Barriers value are interpreted differently depends on the duration input, if the contract span over 24 hours,
 *    the barrier(s) are interpreted as absolute value, otherwise it is interpreted as relative value, reason being
 *    that transaction happens for the next tick, to prevent some client having a faster feed, thus, having a better
 *    estimation for his bet, we do not allow betting on absolute value, this only apply to intraday contract, because
 *    the value of single tick diminish when contract time is long, we use intraday simply because it's easier for
 *    quants.
 * 3. ticks is always within 5 to 10
 * 4. digit trade is always ticks only
 * 5. barriers are non available for contract below 2 minutes
 * 6. For underlying that's under our control, we allow relative and absolute barrier regardless of intraday or not
 * 7. Relative barrier is always allowed
 * 8. Forward starting do not have barriers
 * 9. All underlying have risefall trade
 *
 *
 * TODO: re-architect the whole dependency mess, and have unit test where applicable
 * possibly a better approach would be notify user for wrong info instead of change to correct value automatically,
 * default may not be a good idea at all as client might always want to input value
 */

export default class FullTradeParams extends Component {
    shouldComponentUpdate = shouldPureComponentUpdate;

    static defaultProps = {
        type: 'full',
    };

    static propTypes = {
        actions: PropTypes.object.isRequired,
        currency: PropTypes.string.isRequired,
        contract: PropTypes.object,
        compact: PropTypes.bool,
        disabled: PropTypes.bool,
        index: PropTypes.number.isRequired,
        trade: PropTypes.object.isRequired,
        type: PropTypes.oneOf(['tick', 'full']).isRequired,
        ticks: PropTypes.array,
    };

    constructor(props) {
        super(props);
        this.onAssetChange = ::this.onAssetChange;
        this.onCategoryChange = ::this.onCategoryChange;
        this.onDurationChange = ::this.onDurationChange;
        this.onDurationUnitChange = ::this.onDurationUnitChange;
        this.onStartDateChange = ::this.onStartDateChange;
        this.onBarrier1Change = ::this.onBarrier1Change;
        this.onBarrier2Change = ::this.onBarrier2Change;
        this.onBasisChange = ::this.onBasisChange;
        this.onAmountChange = ::this.onAmountChange;
        this.onAmountPerPointChange = ::this.onAmountPerPointChange;
        this.onStopLossChange = ::this.onStopLossChange;
        this.onStopTypeChange = ::this.onStopTypeChange;
        this.onStopProfitChange = ::this.onStopProfitChange;
        this.onPurchase = ::this.onPurchase;
    }

    componentWillMount() {
        this.onAssetChange();
    }

    /**
     * componentDidUpdate is used instead of componentWillReceiveProps because the onAssetChange depends on updated
     * props, which only accessible after component update
     * it's a mistake here that method to be reuse are coupled with component states
     * TODO: redesign so that side effect are handle elsewhere
     */
    componentDidUpdate(prevProps) {
        const { trade } = this.props;

        if (trade.symbol !== prevProps.trade.symbol) {
            this.onAssetChange();
        }
    }

    componentWillUnmount() {
        const { trade } = this.props;
        if (trade.proposalError) {
            return;
        }
        LiveData.api.unsubscribeByID(trade.proposal.id);
    }

    updateTradeParams(params) {
        const { actions, index } = this.props;
        actions.updateMultipleTradeParams(index, params);
        actions.updatePriceProposalSubscription(index);
    }

    onAssetChange() {
        const { contract, trade } = this.props;
        const updatedAsset = updateHelpers.changeAsset(trade, contract, updateHelpers.changeCategory);

        this.updateTradeParams(updatedAsset);
    }

    onCategoryChange(newCategory) {
        const { contract } = this.props;
        const updatedCategory = updateHelpers.changeCategory(newCategory, contract);
        this.updateTradeParams(updatedCategory);
    }

    onTypeChange(newType, newCategory) {
        const { contract, trade } = this.props;
        const updatedType = updateHelpers.changeType(newType, newCategory, trade, contract);
        this.updateTradeParams(updatedType);
    }

    onStartDateChange(epoch) {
        const { contract, trade } = this.props;
        const updatedStartDate = updateHelpers.changeStartDate(epoch, contract, trade);
        this.updateTradeParams(updatedStartDate);
    }

    onDurationChange(e) {
        this.updateTradeParams({ duration: e.target.value });
    }

    onDurationUnitChange(e) {
        const newUnit = e.target.value;
        const { contract, trade } = this.props;
        const updatedDurationUnit = updateHelpers.changeDurationUnit(newUnit, contract, trade);
        this.updateTradeParams(updatedDurationUnit);
    }

    onBarrier1Change(e) {
        const { trade } = this.props;
        const inputValue = e.target.value;
        const updatedBarrier1 = updateHelpers.changeBarrier1(inputValue, trade);
        this.updateTradeParams(updatedBarrier1);
    }

    onBarrier2Change(e) {
        const { trade } = this.props;
        const inputValue = e.target.value;
        const updatedBarrier2 = updateHelpers.changeBarrier2(inputValue, trade);
        this.updateTradeParams(updatedBarrier2);
    }

    onBasisChange(e) {
        this.updateTradeParams({ basis: e.target.value });
    }

    onAmountChange(e) {
        const inputValue = e.target.value;
        const updatedAmount = updateHelpers.changeAmount(inputValue);
        this.updateTradeParams(updatedAmount);
    }

    onAmountPerPointChange(e) {
        const inputValue = e.target.value;
        const updatedAmountPerPoint = updateHelpers.changeAmountPerPoint(inputValue);
        this.updateTradeParams(updatedAmountPerPoint);
    }

    onStopTypeChange(e) {
        this.updateTradeParams({ stopType: e.target.value });
    }

    onStopLossChange(e) {
        this.updateTradeParams({ stopLoss: e.target.value });
    }

    onStopProfitChange(e) {
        this.updateTradeParams({ stopProfit: e.target.value });
    }

    onPurchase() {
        const { actions, index } = this.props;
        actions.purchaseByTradeId(index);
    }

    render() {
        const { actions, contract, disabled, index, trade, currency } = this.props;

        /**
         * Race condition happen when contract is updated before tradeCategory (async)
         * thus we need to check if the tradeCategory is valid, if not valid simply use the 1st valid category
         */
        const selectedCategory = trade.tradeCategory;
        const categoryToUse = !!contract[selectedCategory] ? selectedCategory : Object.keys(contract)[0];

        const selectedType = trade.type;
        const contractForCategory = contract[categoryToUse];
        const contractForType = contractForCategory && contractForCategory[selectedType];
        const barriers = contractForType && contractForType.barriers;
        const isBelow2Min = isDurationLessThan2Mins(trade.duration, trade.durationUnit);
        const isIntraDay = isIntraday(trade.duration, trade.durationUnit);
        const pipSize = trade.pipSize;
        const showBarrier = categoryToUse !== 'spreads' &&
            categoryToUse !== 'digits' &&
            !isBelow2Min &&
            !trade.dateStart &&
            !!barriers;

        const payout = trade.proposal && trade.proposal.payout;

        const showDuration = !!contractForType;
        const showDigitBarrier = categoryToUse === 'digits';
        const showSpreadBarrier = categoryToUse === 'spreads';

        return (
            <div className="trade-params" disabled={disabled}>
                <AssetPickerDropDown
                    {...this.props}
                    selectedSymbol={trade.symbol}
                    selectedSymbolName={trade.symbolName}
                />
                <TradeTypeDropDown
                    {...this.props}
                    updateParams={::this.updateTradeParams}
                />
                {showDuration && !showSpreadBarrier &&
                    <DurationCard
                        dateStart={trade.dateStart}
                        duration={+trade.duration}
                        durationUnit={trade.durationUnit}
                        forwardStartingDuration={contractForType.forwardStartingDuration}
                        options={contractForType.durations}
                        onDurationChange={this.onDurationChange}
                        onUnitChange={this.onDurationUnitChange}
                        onStartDateChange={this.onStartDateChange}
                        tradeIndex={index}
                    />
                }
                {showDigitBarrier &&
                    <DigitBarrierCard
                        barrier={+(trade.barrier)}
                        barrierInfo={barriers && barriers.tick[0]}
                        index={index}
                        onBarrierChange={this.onBarrier1Change}
                    />
                }
                {showSpreadBarrier &&
                    <SpreadBarrierCard
                        amountPerPoint={trade.amountPerPoint}
                        stopLoss={trade.stopLoss}
                        stopProfit={trade.stopProfit}
                        stopType={trade.stopType}
                        amountPerPointChange={this.onAmountPerPointChange}
                        currency={currency}
                        index={index}
                        spreadInfo={contractForType.spread}
                        stopTypeChange={this.onStopTypeChange}
                        stopLossChange={this.onStopLossChange}
                        stopProfitChange={this.onStopProfitChange}
                    />
                }
                {showBarrier &&
                    <BarrierCard
                        barrier={trade.barrier}
                        barrier2={trade.barrier2}
                        barrierInfo={barriers}
                        barrierType={trade.barrierType}
                        isIntraDay={isIntraDay}
                        pipSize={pipSize}
                        onBarrier1Change={this.onBarrier1Change}
                        onBarrier2Change={this.onBarrier2Change}
                        onBarrierTypeChange={this.onBarrierTypeChange}
                        spot={trade.proposal && +trade.proposal.spot}
                    />
                }
                {!showSpreadBarrier &&
                    <StakeCard
                        amount={trade.amount.toString()}
                        basis={trade.basis}
                        currency={currency}
                        id={index}
                        onAmountChange={this.onAmountChange}
                        onBasisChange={this.onBasisChange}
                    />
                }
                {payout && <PayoutCard stake={+trade.amount} payout={payout} />}
                <BuyButton
                    askPrice={askPriceFromProposal(trade.proposal)}
                    currency={currency}
                    disabled={disabled}
                    onClick={() => actions.purchaseByTradeId(index)}
                />
                <ErrorMsg
                    shown={!!trade.proposalError}
                    text={trade.proposalError ? trade.proposalError.message : ''}
                />
                <ErrorMsg
                    shown={!!trade.contractForError}
                    text={trade.contractForError || ''}
                />
            </div>
        );
    }
}