/*!
 * videojs-playlists - Playlists done right for Videojs
 * v0.2.0
 * 
 * copyright Antonio Laguna 2015
 * MIT License
*/
//videojs-playlists.js
function playList(options, arg){
  var player = this;
  player.pl = player.pl || {};
  var index = parseInt(options,10);

  player.pl._guessVideoType = function(video){
    var videoTypes = {
      'webm' : 'video/webm',
      'mp4' : 'video/mp4',
      'ogv' : 'video/ogg'
    };
    var extension = video.split('.').pop();

    return videoTypes[extension] || '';
  };

  player.pl.init = function(videos, options) {
    options = options || {};
    player.pl.videos = [];
    player.pl.current = 0;
    player.on('ended', player.pl._videoEnd);

    if (options.getVideoSource) {
      player.pl.getVideoSource = options.getVideoSource;
    }

    player.pl._addVideos(videos);
  };

  player.pl._updatePoster = function(posterURL) {
    player.poster(posterURL);
    player.removeChild(player.posterImage);
    player.posterImage = player.addChild("posterImage");
  };

   var compareSources = function (oneSrc, otherSrc) {
    for (var i = 0; i<oneSrc.length; i++) {
      for (var j=0; j<otherSrc.length; j++) {
        if (oneSrc[i] && otherSrc[j] && oneSrc[i].src === otherSrc[j].src) {
          return true;
        }
      }
    }
    return false;
  };
  
  player.pl._createVideoItem = function(video) {
      var videoItem = Object.create(video);
      var aux = [];
      for (var j = 0, len = videoItem.src.length; j < len; j++){
        aux.push({
          type : player.pl._guessVideoType(videoItem.src[j]),
          src : videoItem.src[j]
        });
      }
      videoItem.src = aux;
      return videoItem;
  };

  player.pl._addVideos = function(videos){
    for (var i = 0, length = videos.length; i < length; i++){
      var videoItem = player.pl._createVideoItem(videos[i]);
      player.pl.videos.push(videoItem);
    }
  };
  
  player.pl._updateVideos = function(newVideos) {
    var currentVideo = player.pl.currentVideo;
    // is current video in the new list?
    var found = newVideos.some(function(video, ind) {
      var videoItem = player.pl._createVideoItem(video);
      if (compareSources(currentVideo.src, videoItem.src)) {
        // if yes, set current index in it's index in new list
        player.pl.current = ind;
        return true;
      } else {
        return false;
      }
    });
    if (!found) {
        // if no, preserve old index
        // just check out of range
        if (player.pl.current >= newVideos.length) {
          player.pl.current = newVideos.length - 1;
        }
    }
    player.pl.videos = [];
    player.pl._addVideos(newVideos);
  };
  
  player.pl._nextPrev = function(func){
    var comparison, addendum;

    if (func === 'next'){
      comparison = player.pl.videos.length -1;
      addendum = 1;
    }
    else {
      comparison = 0;
      addendum = -1;
    }

    if (player.pl.current !== comparison){
      var newIndex = player.pl.current + addendum;
      player.pl._setVideo(newIndex);
      player.trigger(func, [player.pl.videos[newIndex]]);
    } else if (player.pl.loop && player.pl.videos.length > 0) {
      var loopInd = (addendum === -1)? player.pl.videos.length - 1: 0;
      player.pl._setVideo(loopInd);
      player.trigger(func, [player.pl.videos[loopInd]]);
    }
  };

  player.pl._setVideo = function(index){
    if (index < player.pl.videos.length){
      player.pl.current = index;
      player.pl.currentVideo = player.pl.videos[index];

      if (!player.paused()){
        player.pl._resumeVideo();
      }

      if (player.pl.getVideoSource) {
        player.pl.getVideoSource(player.pl.videos[index], function(src, poster) {
          player.pl._setVideoSource(src, poster);
        });
      } else {
        player.pl._setVideoSource(player.pl.videos[index].src, player.pl.videos[index].poster);
      }
    }
  };

  player.pl._setVideoSource = function(src, poster) {
    player.src(src);
    player.pl._updatePoster(poster);
  };

  player.pl._resumeVideo = function(){
    player.one('loadstart',function(){
      player.play();
    });
  };

  player.pl._videoEnd = function(){
    if (player.pl.current === player.pl.videos.length -1){
      player.trigger('lastVideoEnded');
      if (player.pl.loop) {
        player.pl._resumeVideo();
        player.next();
      }
    } else {
      player.pl._resumeVideo();
      player.next();
    }
  };

  if (options instanceof Array){
    player.pl.init(options, arg);
    player.pl._setVideo(0);
    return player;
  }
  else if (index === index){ // NaN
    player.pl._setVideo(index);
    return player;
  }
  else if (typeof options === 'string' && typeof player.pl[options] !== 'undefined'){
    player.pl[options].apply(player);
    return player;
  }
}

videojs.Player.prototype.next = function(){
  this.pl._nextPrev('next');
  return this;
};
videojs.Player.prototype.prev = function(){
  this.pl._nextPrev('prev');
  return this;
};

videojs.Player.prototype.updatePlayList = function(newVideos){
  this.pl._updateVideos(newVideos);
  return this;
};

videojs.plugin('playList', playList);
