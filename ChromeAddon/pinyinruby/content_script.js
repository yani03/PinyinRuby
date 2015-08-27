(function () {
	var allowedTags = ["a", "abbr", "address", "b", "bdo", "big", "blink", "blockquote", "caption", "center", "cite", "col", "colgroup", "dd", "del", "dfn", "dir", "div", "dl", "dt", "em", "fieldset", "font", "form", "h1", "h2", "h3", "h4", "h5", "h6", "i", "ins", "isindex", "label", "legend", "li", "link", "marquee", "menu", "noframes", "noscript", "ol", "p", "q", "s", "small", "span", "strike", "strong", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "tt", "u", "ul"];
	function attachRuby(ownerNode, node) {
		var text = node.textContent;
		chrome.runtime.sendMessage(text, function (response) {
			var naiveText = "";
			for (var i in text) {
				if (response[i]) {
					if (naiveText.length > 0) {
						ownerNode.insertBefore(document.createTextNode(naiveText), node);
						naiveText = "";
					}
					var rubyNode = document.createElement("ruby");
					var rbNode = document.createElement("rb");
					var rtNode = document.createElement("rt");
					rbNode.textContent = text[i];
					rtNode.textContent = response[i];
					rubyNode.appendChild(rbNode);
					rubyNode.appendChild(rtNode);
					ownerNode.insertBefore(rubyNode, node);
				} else {
					naiveText += text[i];
				}
			}
			if (naiveText.length > 0) {
				ownerNode.insertBefore(document.createTextNode(naiveText), node);
			}
			ownerNode.removeChild(node);
		});
	};
	function attachRubyWalk(ownerNode) {
		var node = ownerNode.firstChild;
		while (node) {
			switch (node.nodeType) {
				case Node.ELEMENT_NODE:
					if (allowedTags.indexOf(node.nodeName.toLowerCase()) >= 0) {
						attachRubyWalk(node);
					}
					break;
				case Node.TEXT_NODE:
					attachRuby(ownerNode, node);
					break;
			}
			node = node.nextSibling;
		}
	};
	attachRubyWalk(document.body);
})();
