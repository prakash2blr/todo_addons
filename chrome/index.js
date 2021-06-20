/*
* @Author: prakash
* @Date:   2021-06-14 22:05:03
* @Last Modified by:   prakash
* @Last Modified time: 2021-06-20 19:32:00
*/
// const tabId = getTabId();
// chrome.tabs.create({'url': 'index.html'}, function(tab) {

// });
function openPage() {
  chrome.tabs.create({
    url: "index.html"
  });
}

chrome.action.onClicked.addListener(openPage);
