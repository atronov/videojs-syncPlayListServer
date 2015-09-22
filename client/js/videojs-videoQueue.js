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
		var container = player.el().querySelector(".image_container");
		if (!container) {
			container = document.createElement("div");
			container.className = "image_container";
			var img = document.createElement("img");
			img.className = "video_image";
			container.appendChild(img);
			player.el().appendChild(container);
		} else {
			img = container.querySelector(".video_image");
		}
		container.style.display = "block";
		img.src = imgPath;
	}
	
	function hideImage(player) {
		var container = player.el().querySelector(".image_container");
		if (container) {
			container.style.display = "none";
		}
	}
	
	function appendStyle() {
		if (!stylesAppended) {
			var css = '\
			.image_container {\
				position: absolute;\
				top: 0; left: 0; width: 100%; height: 100%;\
				text-align: center;\
        	}\
        	.video_image {\
				max-height: 100%; max-width: 100%;\
				height: auto;\
        	}',
			head = document.head || document.getElementsByTagName('head')[0],
			style = document.createElement('style');
		
			style.type = 'text/css';
			if (style.styleSheet){
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}
			
			head.appendChild(style);
			stylesAppended = true;s
		}
	}
})(window);

videojs.plugin('videoQueue', videoQueue);