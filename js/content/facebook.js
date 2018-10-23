const content_parser = function (node) {

    const images = [...node.getElementsByClassName('mbs _6m6 _2cnj _5s6c')];

    images.forEach(function (el) {
        let links = el.getElementsByTagName('a');
        let long_url_str = links[0].href
        let long_url = new URL(long_url_str);
        let short_url = long_url.searchParams.get("u");
        console.log("SHORT_URL", short_url);

        // var request = new XMLHttpRequest();
        // request.onreadystatechange = function () {
        //     if (request.readyState === 4) {
        //         if (request.status === 200) {
        //             var data = JSON.parse(request.responseText);
        //             var clickbait = data.clickbaitiness;
        //             if (clickbait < 60) {
        //                 let html = "<ul style='position:absolute;top:30px;right:10px;padding:5px;font-size:12px;line-height:1.8;background-color:#2ecc71;color:#fff;border-radius:5px'>👍 Not Clickbait</ul>";
        //                 el.insertAdjacentHTML('afterend', html);
        //             }
        //             else if (clickbait > 90) {
        //                 let html = "<ul style='position:absolute;top:30px;right:10px;padding:5px;font-size:12px;line-height:1.8;background-color:#F27935;color:#fff;border-radius:5px'>💁 This is Clickbait</ul>";
        //                 el.insertAdjacentHTML('afterend', html);
        //             }
        //             else {
        //                 let html = "<ul style='position:absolute;top:30px;right:10px;padding:5px;font-size:12px;line-height:1.8;background-color:#e67e22;color:#fff;border-radius:5px'>👻 " + clickbait + "% clickbait</ul>";
        //                 el.insertAdjacentHTML('afterend', html);
        //             }
        //         }
        //     }
        // };

        // request.open("GET", "https://clickbait-detector.herokuapp.com/detect?headline=" + link, true);
        // request.send();
    });

};

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