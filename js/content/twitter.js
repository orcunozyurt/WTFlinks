const content_parser = function (node) {
    $('.stream-item').each(function (index) {
        var username = $(this).find('.username').find('b').html();
        var url = $(this).find('.tweet-text').find('a.twitter-timeline-link').attr('data-expanded-url');

        if (url !== undefined && url !== "" && url !== null && url.includes("twitter.com") === false) {

            if ($(this).find('.Ncb').html() === undefined) {
                $(this).find('.ProfileTweet-actionList').append(ncb_button(url, username));
                chrome.runtime.sendMessage({
                    message: "setlistener",
                    content_url: url,
                    account: username
                }, function (response) {});
            }

        }
    });
}

const ncb_button = function (url, username) {
    var imgURL = chrome.extension.getURL("images/bloody_eye.png");
    return `
    <div class="ProfileTweet-action Ncb">
        <button class="ProfileTweet-actionButton u-textUserColorHover js-actionButton ncb-button" data-original-content="${encodeURI(url) + " " + username}" type="button">
        <div class="IconContainer js-tooltip" title="Show Content of URL">
            <img src="` + imgURL + `" height="40" width="40"/>
            <span class="u-hiddenVisually">Show Content of URL</span>
        </div>
        </button>
    </div>`;
}

const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
            if (node.nodeType === 1) { // ELEMENT_NODE
                content_parser(node);
            }
        });
    });
});

const config = {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true
}

observer.observe(document.body, config);

content_parser(document.body);