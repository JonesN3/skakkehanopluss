(function ($) {
    function notifyState (message, style) {
        message = message || "Lagret endringer."
        style = style || false

        if (style) {
            $("#notify-change").toggleClass("."+style);
        }

        $("#notify-change").empty().text(message)
        $("#notify-change").fadeIn(400)

        setTimeout(() => {
            $("#notify-change").fadeOut(400)
        }, 1000)
    }

    function toggleOption (key) {
        var optionPromise = browser.storage.sync.get(key)

        optionPromise.then(function (optionValue) {
            optionValue = optionValue || false

            if (optionValue) {
                browser.storage.sync.set({key: !optionValue})
                    .then(null, onError)
            } else {
                browser.storage.sync.set({key: false})
                    .then(null, onError)
            }
        }, onError)
    }

    function onError (err) {
        notifyState("err: "+err, "error")
    }

    // derp...
    function getHostFromURL (url) {
        var protocols = ["http://", "https://"]
        for (var i = 0; i < protocols.length; i++) {
            var protocol = protocols[i]
            if (url.startsWith(protocol)) {
                url = url.replace(protocol, "").replace("/", "")
            }
        }
        return url
    }

    $(document).ready(function () {
        var verboseCheckbox = $("#verbose")
        var bigRedButton = $("#big-red-button")
        var buttonStrings = {
            'unblock': "Jæ har pluss på denna sia.",
            'block': "Jæ vi'kke ha no' pluss her lenger!",
        }

        browser.storage.onChanged.addListener((changes) => {
            for (key in changes) {
                if (key === "verbose") {
                    verboseCheckbox.prop('checked', changes[key])
                } else {
                    browser.tabs.query({
                        active: true,
                        currentWindow: true,
                    }, function (tabs) {
                        var tab = tabs[0]
                        var host = getHostFromURL(tab.url)
                        console.log(host)
                    })
                }
            }
        })

        browser.storage.sync.get()
            .then((items) => {
                for (var item in items) {
                    if (item === 'verbose') {
                        verboseCheckbox.prop('checked', items[item])
                    } else {
                        browser.tabs.query({
                            active: true,
                            currentWindow: true,
                        })
                    }
                }
            });

        for (var input in inputs) {
            var el = inputs[input]
            browser.storage.sync.get(input, (obj) => {
                el.prop('checked', obj[input])
            })
        }

        verboseCheckbox.click(() => {
            toggleOption('verbose')
        })

        bigRedButton.click(() => {
            toggleOption(window.host)
        })
    })

})(jQuery)
