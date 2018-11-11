const content_parser = function (node) {
    $('.stream-item').each(function (index) {
        let username = $(this).find('.username').find('b').html();
        let url = $(this).find('.tweet-text').find('a.twitter-timeline-link').attr('data-expanded-url');

        if (url !== undefined && url !== "" && url !== null && url.includes("twitter.com") === false) {

            if ($(this).find('.Ncb').html() === undefined) {

                $(this).find('.ProfileTweet-actionList').append(ncb_button(url));

                chrome.runtime.sendMessage({
                    message: "SETLISTENER",
                    content_url: url,
                    account: username
                }, function (response) {});
            }

        }
    });
}

const ncb_button = function (url) {
    var imgURL = chrome.extension.getURL("images/icon-128px.png");
    return `
    <div class="ProfileTweet-action Ncb">
        <button class="ProfileTweet-actionButton u-textUserColorHover js-actionButton wtf-button" data-original-content="${encodeURI(url)}" type="button">
        <div class="IconContainer js-tooltip" title="${encodeURI(url)}">
            <img src="` + imgURL + `" height="32" width="32"/>
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