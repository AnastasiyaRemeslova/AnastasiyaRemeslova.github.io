
 /*       function goFullscreen() {
            // Must be called as a result of user interaction to work
            mf = document.getElementById("main");
            mf.webkitRequestFullscreen();
        }

        function fullscreenChanged() {
            if (document.webkitFullscreenElement == null) {
                mf = document.getElementById("main");
                //mf.style.display="none";
            }
        }

        document.onwebkitfullscreenchange = fullscreenChanged;
        document.documentElement.onclick = goFullscreen;
        document.onkeydown = goFullscreen;
  */  
var videoActiveJS, choice;
var videojsPlayers;
var videos;

function videoCreate(videoJQuery) {
    var video = {
    id: '',
    scene: videoJQuery.parent().attr('class').slice(0, videoJQuery.parent().attr('class').indexOf(' ')),
    type: videoJQuery.attr('class').slice(0, videoJQuery.attr('class').indexOf(' ')),
    vHTML: '',
    vJQuery: '',
    vPlayer: videojsCreate(videoJQuery.get(0)),
};
    
    video.id = video.vPlayer.id();
    video.vJQuery = $('#'+video.id);
    video.vHTML = video.vJQuery.get(0);
    return video;
}

function findVideoById(id){
    var video;
    $.each(videos, function(){
        if(this.id == id){
            video = this;
        }
    });
    return video;
}

function findVideoBySceneAndType(scene, type){
    var video;
    $.each(videos, function(){
        if(this.scene == scene && this.type == type){
            video = this;
        }
    });
    return video;
}

function videojsCreate(video){
    var videoj = videojs(video, {
      "autoplay": true,
      controlBar: {
        children: [
          "playToggle",
          "volumeMenuButton",
          "durationDisplay",
          "timeDivider",
          "currentTimeDisplay",
          "progressControl",
          "remainingTimeDisplay",
          "fullscreenToggle"
        ]
      }, "fluid": true
    });
    videoj.dimensions(window.width, window.height);

    return videoj;
}


function playVideo(video) {

    var vClass = video.attr('class').slice(0, video.attr('class').indexOf(' '))
    var cClass = video.parent().attr('class').slice(0, video.parent().attr('class').indexOf(' '));
    var nextVideo;
    $.each(videos, function () {
        var player = this.vPlayer;
        if(player.hasClass(vClass) && $('#'+player.id()).parent().hasClass(cClass)){
            nextVideo = player;
        }
    });

    $('.choice').fadeOut(0);

    var lastVideo = $('.active > .active');
    lastVideo.removeClass('active');
    lastVideo.addClass('hide');

    video.removeClass('hide');
    video.addClass('active');
    nextVideo.load();
    nextVideo.play();
} 

$(document).ready(function() {

    choice = false;

    //$('.choice, .navigation').hide();

    videojsPlayers = [];
    videos = [];

   $.each($('video'), function(){
        $(this).addClass('video-js vjs-default-skin');

        videos.push(videoCreate($(this)));
        //videojsPlayers.push(videojsCreate($(this).get(0)));
    });

    $('.ch_1, .ch_2').click(function() {
        choice = true;
        var id = '.'+ $(this).attr('class').replace(/ch/,'v');
        var video = $(this).parent().parent().parent().find(id);
        playVideo(video);
    });

    var videoHTML = $('.active > .active');

    $.each(videos, function () {
        var player = this.vPlayer;

        player.on('play', function(){

            console.log('!!!!!!!!!!!!!', player);

            videoHTML = $('.active > .active');
                
            player.on('timeupdate', function () {
                if(!choice & this.currentTime() >= this.duration()-2) {
                    videoHTML.parent().find('.choice').fadeIn(0);
                }
            });
                
            
            player.on('ended', function(){
                
                if(this.hasClass('v_1') || this.hasClass('v_2')){
                    choice = false;

                    var lastVideoConteiner = videoHTML.parent();
                    var lastVideo = videoHTML;

                    lastVideo.removeClass('active');
                    lastVideo.addClass('hide');

                    lastVideoConteiner.removeClass('active');
                    lastVideoConteiner.addClass('hide');
                    this.pause();

                    if(videoHTML.parent().next()[0]){
                        var nextVideoContainer = videoHTML.parent().next();
                        var nextVideo = nextVideoContainer.find('.v_main');

                        nextVideoContainer.removeClass('hide');
                        nextVideoContainer.addClass('active');

                        nextVideo.removeClass('hide');
                        nextVideo.addClass('active');

                        var vClass = nextVideo.attr('class').slice(0, nextVideo.attr('class').indexOf(' '))
                        var cClass = nextVideo.parent().attr('class').slice(0, nextVideo.parent().attr('class').indexOf(' '))
                        var nextVideoJS;
                        $.each(videos, function () {
                            var player = this.vPlayer;
                            if(player.hasClass(vClass) && $('#'+player.id()).parent().hasClass(cClass)){
                                nextVideoJS = player;
                            }

                        });
                    
                        nextVideoContainer.removeClass('hide');
                        nextVideoContainer.addClass('active');

                        nextVideo.removeClass('hide');
                        nextVideo.addClass('active');
                        nextVideoJS.play();
                    }
                }
            });
        });
    });

    $('.v_main').on('timeupdate', function(){
        if(!choice & this.currentTime >= this.duration-2) {
            $(this).parent().find('.choice').fadeIn(0);
        }
    });

    $('.button').click(function() {
        $('.navigation').fadeIn(0);
    });

    $('.navigation > div').click(function() {
        choice = false;
        var scene = $('.videos').find('.'+$(this).attr('class'));

        var nextVideo = findVideoBySceneAndType($(this).attr('class'), 'v_main');

        var currentVideo = findVideoById($('.active > .active').attr('id'));
        currentVideo.vPlayer.pause();
        currentVideo.vPlayer.currentTime(0);


        currentVideo.vJQuery.removeClass('active');
        currentVideo.vJQuery.addClass('hide');

        var currentScene = $('.videos > .active');

        currentScene.removeClass('active');
        currentScene.addClass('hide');



        scene.removeClass('hide');
        scene.addClass('active');

        nextVideo.vJQuery.removeClass('hide');
        nextVideo.vJQuery.addClass('active');
        nextVideo.vPlayer.play();
        $(this).parent().hide();
    })
});        



/*
document.documentElement.onclick = fullScreen(document.documentElement);
document.onkeydown = goFullscreen;

function fullScreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.webkitrequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.mozRequestFullscreen) {
    element.mozRequestFullScreen();
  }
}*/