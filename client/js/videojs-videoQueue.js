/**
 * @param {object} Same options as for getVideoSource plugin
 * @return {Promise} Same return as for getVideoSource plugin
 */
var videoQueue = (function(window) {
	'use strict';
	
	var document = window.document;
	
	var stylesAppended = false;
	
	if (window.jQuery) {
		window.$(appendStyle);
	} else {
		document.addEventListener("DOMContentLoaded", appendStyle);
		window.onload = appendStyle;
	}
	
	
	return handle;
	
	function handle(options) {
		var player = this;
		options.getVideoSource = getVideoSource.bind(player);
		return player.syncPlayList(options);
	}
	
	function getVideoSource(node, cb) {      
		var player = this;
		var emptyVideoPaths = [ { src: "/video/empty.webm" } ];
		var src = node.src;
		var poster = node.poster;
		if (node.isSlide) {
			src = emptyVideoPaths;
			showImage(player, poster);
		} else {
			hideImage(player);
		}
		cb(src, poster);
	}
	
	function showImage(player, imgPath) {
		var slide = player.el().querySelector(".slide-image");
		if (!slide) {
			slide = document.createElement("div");
			slide.className = "slide-image";
			player.el().appendChild(slide);
		}
		slide.style.display = "block";
		slide.style.backgroundImage = "url("+imgPath+")";
	}
	
	function hideImage(player) {
		var slide = player.el().querySelector(".slide-image");
		if (slide) {
			slide.style.display = "none";
		}
	}
	
	function appendStyle() {
		if (!stylesAppended) {
			var css = '\
			.slide-image {\
				position: absolute;\
				top: 0; left: 0; width: 100%; height: 100%;\
				background-size: contain;\
				background-position: center;\
				background-repeat: no-repeat;\
        	}';
			var head = document.head || document.getElementsByTagName('head')[0],
				style = document.createElement('style');
		
			style.type = 'text/css';
			if (style.styleSheet){
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}
			
			head.appendChild(style);
			stylesAppended = true;
		}
	}
})(window);

videojs.plugin('videoQueue', videoQueue);