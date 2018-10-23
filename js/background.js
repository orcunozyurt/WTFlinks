// Works in background 
'use strict';

// Make sure the extension only works on pages stated below
chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {
                    hostEquals: 'twitter.com'
                },
            }),
            new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {
                    hostEquals: 'www.facebook.com'
                },
            })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
});