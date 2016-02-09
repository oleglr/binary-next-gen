import React from 'react';
import MobilePage from '../mobile/MobilePage';
import TradeTypePickerContainer from './TradeTypePickerContainer';

export default (props) => (
	<MobilePage toolbarShown={false} backBtnBarTitle="Trade Type">
		<TradeTypePickerContainer {...props} />
	</MobilePage>
);
