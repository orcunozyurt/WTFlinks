// Works in background 
'use strict';

var config = {
    apiKey: "AIzaSyB1C2s42GYKjfvApEypJTpBiMD68ibLTEo",
    authDomain: "noclickbait-10daa.firebaseapp.com",
    databaseURL: "https://noclickbait-10daa.firebaseio.com",
    projectId: "noclickbait-10daa",
    storageBucket: "noclickbait-10daa.appspot.com",
    messagingSenderId: "568867360212"
};

// Initialize Firebase
firebase.initializeApp(config);

var ref = firebase.database().ref();
ref.on("value", function (snapshot) {
    snapshot = JSON.stringify(snapshot.val(), null, 2);
    chrome.storage.sync.set({
        'data': snapshot
    }, function () {

    });
});

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

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        if (request.message == "PAGEDATA") {
            let url = request.content_url;
            loadContent(url)
                .then(response => {
                    let page_html_content = response[1];
                    let final_url = response[0];
                    getContentFromResponse(page_html_content, getHostName(final_url))
                        .then(message => {
                            sendResponse({
                                message: message
                            });
                        });

                })

            return true;

        } else if (request.message == "SETLISTENER") {
            //set Listener for buttons
            chrome.tabs.executeScript(null, {
                file: 'js/listener.js'
            });

            sendResponse({
                message: "OK"
            });
        }

    });

function loadContent(url) {
    return fetch(url)
        .then(response => {
            return Promise.all([
                response.url,
                response.text()
            ])
        })
        .catch(error => error.message);
}

const getContentFromResponse = (response, hostname) => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['data'], function (result) {
            var remoteObject = JSON.parse(result.data);
            var ruleslist = remoteObject.newsnetworks;
            if (NewsNetworkExists(hostname, ruleslist)) {

                let rules = ruleslist[hostname];
                let parent_idendifier = rules.parent_idendifier;
                let identifier_type = rules.identifier_type;
                let tag = rules.tag;
                let content = GetSpecialContentFromRules(response, parent_idendifier, identifier_type, tag);
                return resolve(content);

            } else {
                let content = GetAllElementsWithPtag(response);
                return resolve(content);
            }

        });
    });
}

function getHostName(url) {
    let match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2].replace(/\./g, "-");
    } else {
        return null;
    }
}

function NewsNetworkExists(hostname, ruleList) {
    return ruleList[hostname] !== undefined;
}

function GetAllElementsWithPtag(el) {
    let html = document.createElement('html');
    html.innerHTML = el
    let content = [];
    let parr = html.querySelectorAll('p');

    parr.forEach(function (element) {
        content.push(element.innerText);
    });

    return content;

}

function GetSpecialContentFromRules(document_str, parent_idendifier, class_or_id, tag) {

    let html = document.createElement('html');
    html.innerHTML = document_str;

    var content = [];
    if (class_or_id === 'class') {
        let nodeArr = html.getElementsByClassName(parent_idendifier);
        let node = nodeArr[0];
        if (node !== undefined) {
            let parr = node.querySelectorAll(tag);

            parr.forEach(function (element) {
                content.push(element.innerText);
            });
        }

    } else if (class_or_id === 'id') {
        let node = html.getElementById(parent_idendifier);
        let parr = node.querySelectorAll(tag);
        parr.forEach(function (element) {
            content.push(element.innerText);
        });

    }

    if (content.length === 0) {
        content = GetAllElementsWithPtag(document_str);
    }


    return content;
}