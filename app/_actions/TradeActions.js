import * as types from '../_constants/ActionTypes';

export const serverDataPortfolio = (serverResponse) => ({
    type: types.SERVER_DATA_PORTFOLIO,
    serverResponse,
});

export const detailsForContract = (areDetailsShown, contractShown) => ({
    type: types.DETAILS_FOR_CONTRACT,
    areDetailsShown,
    contractShown,
});

export const serverDataProposalOpenContract = (serverResponse) => ({
    type: types.SERVER_DATA_PROPOSAL_OPEN_CONTRACT,
    serverResponse,
});

export const serverDataProposal = (serverResponse) => ({
    type: types.SERVER_DATA_PROPOSAL,
    serverResponse,
});

export const updateTickTradeParameters = (parameters) => ({
    type: types.UPDATE_TICK_TRADE_PARAMETERS,
    parameters,
});
