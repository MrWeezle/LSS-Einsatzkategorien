// ==UserScript==
// @name        Einsatzkategorien Updater
// @namespace   Leitstellenspiel
// @include     http*://www.leitstellenspiel.de/*
// @version     1.0.1
// @author      FFInningen
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at      document-idle
// ==/UserScript==

$("head").append('<script id="lss_manager_js" src="https://github.com/MrWeezle/LSS-Einsatzkategorien/raw/master/lss-ffinningen.user.js"  type="text/javascript"></script>');
