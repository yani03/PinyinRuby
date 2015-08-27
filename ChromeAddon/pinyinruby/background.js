(function () {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", chrome.extension.getURL("reading.json"), true);
	xhr.addEventListener("readystatechange", function () {
		if (xhr.readyState == 4) {
			var reading = JSON.parse(xhr.responseText);
			chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
				var rubies = [];
				for (var i in request) {
					var c = request[i];
					rubies.push(c in reading ? reading[c] : null);
				}
				sendResponse(rubies);
			});
			chrome.browserAction.onClicked.addListener(function (tab) {
				var tabId = tab.id;
				chrome.browserAction.disable(tabId);
				chrome.browserAction.setBadgeText({ text: "…", tabId: tabId });
				chrome.tabs.executeScript(tab.id, { file: "content_script.js", runAt: "document_end" }, function () {
					chrome.browserAction.setBadgeText({ text: "pīn", tabId: tabId });
				});
			});
		}
	}, false);
	xhr.send();
})();
