import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { NumberPlain, LanguagePicker } from '../common';

@connect(state => ({ account: state.account }))
export default class NavigationMenu extends React.Component {

	static propTypes = {
		account: React.PropTypes.object.isRequired,
	};

	render() {
		const account = this.props.account.toJS();
		return (
			<nav className="sidebar">
				<div className="account-info">
					{account.loginid}<br/>
					{account.email}<br/>
					<NumberPlain currency={account.currency} value={account.balance} />
				</div>
				<Link to={`/tick-trade`} className="sidebar-btn" activeClassName="active"><img src="/public/trade.svg" />Trade</Link>
				<Link to={`/watchlist-mobile`} className="sidebar-btn" activeClassName="active"><img src="/public/watchlist.svg" />Trade</Link>
				<Link to={`/portfolio-mobile`} className="sidebar-btn" activeClassName="active"><img src="/public/portfolio.svg" />Open Positions</Link>
				<Link to={`/profit-table-mobile`} className="sidebar-btn" activeClassName="active"><img src="/public/profit.svg" />Profit Table</Link>
				<Link to={`/statement-mobile`} className="sidebar-btn" activeClassName="active"><img src="/public/statement.svg" />Statement</Link>
				<LanguagePicker />
				<Link to={`/settings-mobile`} className="sidebar-btn" activeClassName="active"><img src="/public/settings.svg" /> Settings</Link>
				<Link to={`/`} className="sidebar-btn" activeClassName="active"><img src="/public/signout.svg" /> Sign Out</Link>
			</nav>
		);
	}
}
