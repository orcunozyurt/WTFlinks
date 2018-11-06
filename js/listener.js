var buttons = document.getElementsByClassName("wtf-button");

Array.prototype.forEach.call(buttons, element => {
    var data = element.getAttribute("data-original-content");
    var url = getURLfromData(data);
    var username = getUsernameFromData(data);

    element.classList.remove("wtf-button");
    element.addEventListener('click', function (event) {

        chrome.runtime.sendMessage({
            message: "PAGEDATA",
            content_url: url
        }, function (response) {
            if (chrome.runtime.lastError) {
                // Something went wrong
                console.warn("Whoops.. " + chrome.runtime.lastError.message);
                // Maybe explain that to the user too?
            }

            var parent = getClosest(event.target, '.content');
            if (!parent) {
                parent = getClosest(event.target, '.userContentWrapper')
            }

            if (parent.querySelector(".tweet-ncb-container") != null) {
                parent.removeChild(parent.querySelector(".tweet-ncb-container"));
            } else {

                var newdiv = document.createElement('div');
                newdiv.className = 'tweet-ncb-container _5pbx userContent _3576';
                newdiv.style.padding = '10px'

                response.message.forEach(function (element) {
                    var br = document.createElement('br');
                    var p = document.createElement('p');
                    p.innerHTML = element;

                    newdiv.appendChild(br);
                    newdiv.appendChild(p);
                    parent.appendChild(newdiv);

                });

            }
        });

    });
});

function getURLfromData(data) {
    var arrayOfStrings = data.split(" ");

    return arrayOfStrings[0];

}

function getUsernameFromData(data) {
    var arrayOfStrings = data.split(" ");

    return arrayOfStrings[1];

}


var getClosest = function (elem, selector) {

    // Element.matches() polyfill
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function (s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
            };
    }

    // Get the closest matching element
    for (; elem && elem !== document; elem = elem.parentNode) {
        if (elem.matches(selector)) return elem;
    }
    return null;

};