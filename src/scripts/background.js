//TODO: remove background script if it is not needed
var utils = require('./utils');

function init(){
  chrome.tabs.onActivated.addListener(function(tab) {
    utils.getCurrentTabUrl(function(url){
      console.log(url);
    });
  });

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    utils.getCurrentTabUrl(function(url){
      console.log(url);
    });
  });

  chrome.tabs.onCreated.addListener(function(tabId, changeInfo, tab) {
    utils.getCurrentTabUrl(function(url){
      console.log(url);
    });
  });
}

init();
