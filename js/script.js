
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

$(document).ready(function() {

    var choice = false;

    $('.choice').hide();

           
    $('.ch_1, .ch_2').click(function() {
        choice = true;
        var id = '.'+ $(this).attr('class').replace(/ch/,'v');
        var video = $(this).parent().parent().parent().find(id);
        playVideo(video);
    });



    $('.v_main').on('timeupdate', function(){
        if(!choice & this.currentTime >= this.duration-2) {
            $(this).parent().find('.choice').fadeIn(0);
        }
    });

    $('.v_1, .v_2').on('ended', function(){
        choice = false;

        var lastVideoConteiner = $(this).parent();
        var lastVideo = $(this);

        lastVideo.removeClass('active');
        lastVideo.addClass('hide');

        lastVideoConteiner.removeClass('active');
        lastVideoConteiner.addClass('hide');

        if($(this).parent().next()[0]){
        var nextVideoContainer = $(this).parent().next();
        var nextVideo = nextVideoContainer.find('.v_main');

        nextVideoContainer.removeClass('hide');
        nextVideoContainer.addClass('active');

        nextVideo.removeClass('hide');
        nextVideo.addClass('active');
        nextVideo.get(0).play();
    }

    });



});        

function playVideo(video) {

    $('.choice').fadeOut(0);

    var lastVideo = $('.active > .active');
    lastVideo.removeClass('active');
    lastVideo.addClass('hide');

    video.removeClass('hide');
    video.addClass('active');
    video.get(0).play();
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