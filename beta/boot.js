/* eslint-disable */
'use strict';

(function init() {
    // clean stale data in local storage
    localStorage.removeItem('assets');
    localStorage.removeItem('settings');

    var defaultConfig = {
        language: 'EN',
        theme: 'light',
        accounts: []
    };

    function parseOAuthResponse(responseUrl) {
        var matcher = /acct\d=(\w+)&token\d=([\w-]+)&cur\d=(\w+)/ig;
        var urlParts = responseUrl.split('?');
        if (urlParts.length !== 2) {
            throw new Error('Not a valid url');
        }

        var params = urlParts[1].split(matcher);

        var accounts = [];

        for (var i = 1; i < params.length; i += 4) {
            var account = params[i], token = params[i + 1], currency = params[i + 2];
            account && token && currency &&
            accounts.push({ account: account, token: token, currency : currency,});
        }

        return accounts;
    }

    function readConfig() {
        try {
            window.BinaryBoot = JSON.parse(localStorage.getItem('boot')) || defaultConfig;
        } catch (e) {
            window.BinaryBoot = defaultConfig;
            window.console.log('Error while initializing', e);
        }
    }

    function parseUrlAndStoreAccountInfo(url) {
        if (~url.indexOf('acct1')) {
            var accounts = parseOAuthResponse(url);
            window.BinaryBoot.accounts = accounts;
            try {
                localStorage.setItem('boot', JSON.stringify(window.BinaryBoot));
                localStorage.setItem('account', JSON.stringify({ token: accounts[0].token }));
            } catch (e) {
                window.console.log('Error while saving boot config', e);
            }
        }
    }


    var apiUrl = 'wss://ws.binaryws.com/websockets/v3';

    readConfig();
    parseUrlAndStoreAccountInfo(window.location.href);
    window.BinaryBoot.parseUrl = parseOAuthResponse;
    if(window.cordova) {
        window.BinaryBoot.appId = 1006;
    } else if(window.electron) {
        window.BinaryBoot.appId = 1306;
    } else if (/localhost:/g.test(window.location.href)) {
        window.BinaryBoot.appId = 3588;
    } else if (/arnabk.github.io:/g.test(window.location.href)) {
        window.BinaryBoot.appId = 3604;
    } else if (/beta/g.test(window.location.href)) {
        window.BinaryBoot.appId = 4343; //This is for BETA release
    } else {
        window.BinaryBoot.appId = 1001; //This is for PROD release
    }
    var lang = window.BinaryBoot.language;

    var redirectIndex = window.location.href.indexOf('?');
    if (~redirectIndex) {
        if (window.location.href.indexOf('/beta') === -1) {
            window.location.href = '/';
        } else {
            window.location.href = '/beta';
        }
    }

    window.BinaryBoot.connection = new WebSocket(apiUrl + '?app_id=' + window.BinaryBoot.appId + '&l=' + lang);
})();