// ==UserScript==
// @name         Eye Tracking - CLIENT
// @namespace    http://*/
// @version      0.1
// @description  enables local eye tracking - client
// @author       Jonathan Reisdorf, Project A Ventures
// @include      *
// @grant        none
// ==/UserScript==

if (window.parent) {
    window.parent.postMessage({
        href : document.location.href,
        origin : document.location.origin
    }, '*');
    
    window.addEventListener('scroll', function() {
        window.parent.postMessage({
            scroll : document.documentElement.scrollTop || document.body.scrollTop,
            origin : document.location.origin
        }, '*');
    });
}