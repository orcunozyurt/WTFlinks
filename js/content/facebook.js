const content_parser = function (node) {

    const feed_item = [...node.getElementsByClassName('_5pcr userContentWrapper')];

    feed_item.forEach(function (item) {
        let url = null;
        const images = [...item.getElementsByClassName('mbs _6m6 _2cnj _5s6c')];
        images.forEach(function (el) {
            let links = el.getElementsByTagName('a');
            let long_url_str = links[0].href
            try {
                let long_url = new URL(long_url_str);
                let short_url = long_url.searchParams.get("u");
                url = new URL(short_url)
            } catch (error) {
                return;
            }
        });

        if (url !== null && url !== undefined) {
            const action_buttons = [...item.getElementsByClassName('_42nr _1mtp')];
            action_buttons[0].insertAdjacentHTML('beforeend', ncb_button(url));

            chrome.runtime.sendMessage({
                message: "SETLISTENER",
                content_url: url
            }, function (response) {});
        }

    });

};

const ncb_button = function (url) {
    var imgURL = chrome.extension.getURL("images/bloody_eye.png");
    return `<span class="_1mto">
    <div class="_khz _4sz1 _4rw5 _3wv2">
    <span class="wtf-button" data-original-content="${encodeURI(url)}" role="button" tabindex="4">
        <div class="IconContainer js-tooltip" title="${encodeURI(url)}">
            <img src="` + imgURL + `" height="40" width="40"/>
        </div>
    </span>
    </div>
</span>`
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