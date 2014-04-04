var DocumentReady = setInterval(function () {
    if (document.readyState !== 'complete') {
        return;
    }
    clearInterval(DocumentReady);

    /*
     * Este trexo de código será executado apenas quando a página tiver sido
     * carregada
     */
    var jasmineReporter = document.getElementsByClassName('html-reporter')[0],
        jasmineBanner = jasmineReporter.getElementsByClassName('banner')[0];

    document.body.insertBefore(jasmineReporter, document.body.childNodes[0]);

}, 100);