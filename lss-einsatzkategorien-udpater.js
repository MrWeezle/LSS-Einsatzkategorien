// ==UserScript==
// @name        Einsatzkategorien Updater
// @namespace   Leitstellenspiel
// @include     http*://www.leitstellenspiel.de/*
// @version     1.0.0
// @author      FFInningen
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at      document-idle
// ==/UserScript==

var imported = document.createElement('script');
imported.src = 'https://github.com/MrWeezle/LSS-Einsatzkategorien/raw/master/lss-ffinningen.user.js';
document.head.appendChild(imported);
