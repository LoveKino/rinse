/**
 * @author  ddchen
 */
var captureobject = require("captureobject");

var ObjectScene = (function() {

	var reBuildObj = function(tree) {
		var pointer = tree.pointer;
		var children = tree.children;
		var type = tree.type;
		var isShowed = tree.isShowed; // pointer was reformed already
		if (type === "leaf" || isShowed) {
			return pointer;
		} else {
			// clear attributes
			emptyPointer(pointer);
			if (type == "array") {
				pointer.length = 0;
			}
			for (var name in children) {
				var child = children[name];
				var childObj = reBuildObj(child);
				pointer[name] = childObj;
			}
		}
		return pointer;
	}

	var emptyPointer = function(pointer) {
		pointer.length = 0;
		for (var name in pointer) {
			if (pointer.hasOwnProperty(name)) {
				pointer[name] = null;
				delete pointer[name];
			}
		}
	}

	return {
		create: function(obj) {
			var obj = obj;
			var tree = captureobject(obj);

			return {
				recovery: function() {
					obj = reBuildObj(tree);
					return obj;
				}
			}
		}
	}
})();

module.exports = {
	cover: function(obj, maxdeepth) {
		return ObjectScene.create(obj, maxdeepth);
	}
}