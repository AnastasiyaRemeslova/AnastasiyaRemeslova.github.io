
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

$(document).ready(function() {

    choice = false;

    $('.choice').hide();

    videojsPlayers = [];

   $.each($('video'), function(){
        $(this).addClass('video-js vjs-default-skin');
        videojsPlayers.push(videojsCreate($(this).get(0)));
    })
    

    $('.ch_1, .ch_2').click(function() {
        choice = true;
        var id = '.'+ $(this).attr('class').replace(/ch/,'v');
        var video = $(this).parent().parent().parent().find(id);
        playVideo(video);
    });

        var videoHTML = $('.active > .active');
       // console.log(this.hasClass('v_main'));
        videojsPlayers.forEach(function (player) {
            player.on('play', function(){


            console.log(player);
        videoHTML = $('.active > .active');
            
            player.on('timeupdate', function () {
                console.log(choice, this.currentTime(), this.duration())
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
//videoActiveJS.reset();
        if(videoHTML.parent().next()[0]){
        var nextVideoContainer = videoHTML.parent().next();
        var nextVideo = nextVideoContainer.find('.v_main');

        nextVideoContainer.removeClass('hide');
        nextVideoContainer.addClass('active');

        nextVideo.removeClass('hide');
        nextVideo.addClass('active');

  
        
        //videoActiveJS = videojsCreate();
       // videojsFunction();
        
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
/*
    $('.v_1, .v_2').on('ended', function(){
        choice = false;

        var lastVideoConteiner = $(this).parent();
        var lastVideo = $(this);

        lastVideo.removeClass('active');
        lastVideo.removeClass('video-js');
        lastVideo.addClass('hide');

        lastVideoConteiner.removeClass('active');
        lastVideoConteiner.addClass('hide');
videoActiveJS.reset();
console.log(videoActiveJS.parent());
        if($(this).parent().next()[0]){

        var nextVideoContainer = $(this).parent().next();
        var nextVideo = nextVideoContainer.find('.v_main');

        nextVideoContainer.removeClass('hide');
        nextVideoContainer.addClass('active');

        nextVideo.removeClass('hide');
        nextVideo.addClass('active video-js');
        
        videoActiveJS = videojsCreate();
        videojsFunction();
        nextVideo.get(0).play();
    }

    });
*/


});        




function videojsCreate(video){
    var videoj = videojs(video, {
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

function videojsFunction(player){

videoHTML = $('.active > .active');
            
            player.on('timeupdate', function () {

            if(!choice & this.currentTime() >= this.duration()-2) {
                videoHTML.parent().find('.choice').fadeIn(0);
            }
        });
            
        
        player.on('ended', function(){
            
            if(this.hasClass('v_1')){
        choice = false;

        var lastVideoConteiner = videoHTML.parent();
        var lastVideo = videoHTML;

        lastVideo.removeClass('active');
        lastVideo.addClass('hide');

        lastVideoConteiner.removeClass('active');
        lastVideoConteiner.addClass('hide');
//videoActiveJS.reset();
        if(videoHTML.parent().next()[0]){
        var nextVideoContainer = videoHTML.parent().next();
        var nextVideo = nextVideoContainer.find('.v_main');

        nextVideoContainer.removeClass('hide');
        nextVideoContainer.addClass('active');

        nextVideo.removeClass('hide');
        nextVideo.addClass('active');

        this.play();
        console.log('!!!!!!!!!!!!!!!!!!!!!!!');
        videojsFunction(this);
        //videoActiveJS = videojsCreate();
       // videojsFunction();
        
    }
}


    });
 
}

function playVideo(video) {

var vClass = video.attr('class').slice(0, video.attr('class').indexOf(' '))
var cClass = video.parent().attr('class').slice(0, video.parent().attr('class').indexOf(' '))
var nextVideo;
videojsPlayers.forEach(function (player) {
    if(player.hasClass(vClass) && $('#'+player.id()).parent().hasClass(cClass)){
        nextVideo = player;
    }
});


    $('.choice').fadeOut(0);

    var lastVideo = $('.active > .active');
    lastVideo.removeClass('active');
    lastVideo.addClass('hide');
//videoActiveJS.reset();
//console.log(videoActiveJS);
    video.removeClass('hide');
    video.addClass('active');
    nextVideo.load();
nextVideo.play();

//videojsFunction(nextVideo);
            //videoActiveJS = videojsCreate();
}    
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