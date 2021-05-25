
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
var videoActiveJS, choice, autoChoice;
var videojsPlayers;
var videos;
var fps = 30;
var timeForChoice, timeForGame;

var money = [
{scene: 1, amount: 200, hasChange: false},
{scene: 2, amount: 1500, ch_1: -1500, ch_2: 0, hasChange: false, hasChoiceChange: false, game: 0},
{scene: 3, amount: 250, ch_1: -200, ch_2: -200 , hasChange: false, hasChoiceChange: false, game: 0},
{scene: 4, amount: 300, ch_1: 0, ch_2: 0 , hasChange: false, hasChoiceChange: false, game: 0},
{scene: 5, amount: 350, ch_1: 0, ch_2: -300, hasChange: false, hasChoiceChange: false, game: 0},
{scene: 6, amount: 100, hasChange: false},
];

var totalMoney = 0;

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
            'playToggle': true,
            'volumeMenuButton': { 'inline': false },
            'timeDivider': false,
            'durationDisplay': false,
            'currentTimeDisplay': false,
            'fullscreenToggle': false,
            'pictureInPictureToggle': false,
            'remainingTimeDisplay': true,
        
      }, "fluid": true
    });
    videoj.dimensions(window.width, window.height);

    return videoj;
}


function playVideo(video, lastVideo) {

    $.each(videos, function () {
        var player = this.vPlayer;
        if(this.id == video.attr('id')){
            nextVideo = this.vPlayer;
        }
    });

    $('.choice').fadeOut(0);

    lastVideo.removeClass('active');
    lastVideo.addClass('hide');

    lastVideo.parent().find('.timer_line').finish();
    lastVideo.parent().find('.timer_line').css('width', 0);

    video.removeClass('hide');
    video.addClass('active');

    //nextVideo.load();
    nextVideo.play();
}

function changeTotalMoney(amount){
    var changeMoney = $('.change_money')
    if(amount<0){
        changeMoney.addClass('spend');
        changeMoney.html(amount);
    } else {
        changeMoney.html('+'+amount);
    }
        
        changeMoney.animate({
            opacity: '100%',
            'marginTop': '0'
        }, 500, function() {
            changeMoney.animate({
                opacity: '0',        
            }, 500, function(){
                changeMoney.css('marginTop','3vw');
                changeMoney.removeClass('spend');
            });

        });
    setTimeout(function(){
        totalMoney += amount;
        $('.total_money').html(totalMoney);
    }, 500);

}

function findObjByJQ(array, JQ){
    var obj;
    $.each(array, function(){
        if(this.JQ.is(JQ)){
            obj = this;
        }
    });
    return obj;
}

function random(min,max){
    return Math.round(Math.random() * (max-min) + min);
}

function collision($div1, $div2) {
    var x1 = $div1.offset().left;
    var y1 = $div1.offset().top;
    var h1 = $div1.outerHeight(true);
    var w1 = $div1.outerWidth(true);
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = $div2.offset().left;
    var y2 = $div2.offset().top;
    var h2 = $div2.outerHeight(true);
    var w2 = $div2.outerWidth(true);
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
}

function playScene(scene){
    var nextVideo;
    if(scene != 'scene_6'){
        nextVideo = findVideoBySceneAndType(scene, 'v_main');
    }
    else{
        if(totalMoney>5000) nextVideo = findVideoBySceneAndType(scene, 'v_1');
        else if(totalMoney>2000) nextVideo = findVideoBySceneAndType(scene, 'v_2');
        else if(totalMoney>400) nextVideo = findVideoBySceneAndType(scene, 'v_3');
        else nextVideo = findVideoBySceneAndType(scene, 'v_4');
    }
    

    nextVideo.vJQuery.parent().removeClass('hide');
    nextVideo.vJQuery.parent().addClass('active');    

    nextVideo.vJQuery.removeClass('hide');
    nextVideo.vJQuery.addClass('active');

    //nextVideo.load();
    nextVideo.vPlayer.play();
}

function showGameEndWindow(game, text){
    $('.game_end').attr('id', game);
    $('.game_end').find('.text').html(text);
    $('.game_end').fadeIn(0);
}

$(document).ready(function() {

    choice = false;
    autoChoice = false;
    timeForChoice = 5;
    timeForGame = 10;

    videojsPlayers = [];
    videos = [];



   $.each($('video'), function(){
        $(this).addClass('video-js vjs-default-skin');

        videos.push(videoCreate($(this)));
    });

    $('.ch_1, .ch_2').click(function() {
        choice = true;

        var id = '.'+ $(this).attr('class').replace(/ch/,'v');
        var video = $(this).parent().parent().parent().find(id);
        var lastVideo = $(this).parent().parent().parent().find('.v_main');
        playVideo(video, lastVideo);
    });

    var videoHTML;

    $.each(videos, function () {
 //       var videoData = this;
        var player = this.vPlayer;

        player.ready(function(){

        var videoData = findVideoById(this.id());
            player.on('play', function(){
                $('.navigation > div > .'+ videoData.scene).removeClass('lock');

            });

           player.on('timeupdate', function(){
                var videoData = findVideoById(this.id());
                var currentScene = Number(videoData.scene.slice(6,7));
                if(this.hasClass('v_main') && !money[currentScene-1].hasChange){
                    if($('#'+this.id()).parent().hasClass('scene_2')){
                        if(this.currentTime() > 8){
                            money[currentScene-1].hasChange = true;
                            changeTotalMoney(money[currentScene-1].amount);
                        }
                    } else{
                        money[currentScene-1].hasChange = true;
                        changeTotalMoney(money[currentScene-1].amount);
                    }
                }
            
                if(!money[currentScene-1].hasChoiceChange){
                    if(this.hasClass('v_1')){
                        changeTotalMoney(money[currentScene-1].ch_1);
                        money[currentScene-1].hasChoiceChange = true;
                    }
                    if(this.hasClass('v_2')){
                        if($('#'+this.id()).parent().hasClass('scene_5')){
                            if(this.currentTime() > 7){
                                changeTotalMoney(money[currentScene-1].ch_2);
                                money[currentScene-1].hasChoiceChange = true;
                            }
                        } else{
                            changeTotalMoney(money[currentScene-1].ch_2);
                            money[currentScene-1].hasChoiceChange = true;
                        }
                    }
                }
            });

            player.on('ended', function(){
                var videoData = findVideoById(this.id());

                var currentScene = Number(videoData.scene.slice(6,7));
                videoHTML = $('#'+this.id());
                console.log(videoData, this, '111', videoHTML);
                if(this.hasClass('v_main') && !videoHTML.parent().hasClass('scene_1')) {

                    if(!choice) {
                        videoHTML.parent().find('.choice').fadeIn(0);
                        var timer = videoHTML.parent().find('.timer_line');
                        timer.animate({
                            width: '100%'
                        }, timeForChoice*1000);

                    }
                    setTimeout(function(){
                        if(!choice && videoHTML.parent().find('.choice').is(':visible')){
                            choice = true;
                            $(videoHTML.parent().find('.ch_1')).trigger('click');
                        }
                    }, timeForChoice*1000);
                }

                if(videoHTML.parent().hasClass('scene_1')){

                    choice = false;
                    
                    var lastVideo = $('#'+this.id());
                    var lastVideoConteiner = lastVideo.parent();

                    lastVideo.removeClass('active');
                    lastVideo.addClass('hide');

                    lastVideoConteiner.removeClass('active');
                    lastVideoConteiner.addClass('hide');
                    //this.pause();

                    
                    if(lastVideo.parent().next()[0]){

                    var nextVideoContainer = lastVideo.parent().next();
                    var nextVideo = nextVideoContainer.find('.v_main');

                    var nextVideoJS = findVideoById(nextVideo.attr('id')).vPlayer;

                    nextVideoContainer.addClass('active');
                    nextVideoContainer.removeClass('hide');
                        
                    nextVideo.addClass('active');
                    nextVideo.removeClass('hide');
                        
                    nextVideoJS.play();
                        
                    }
                    
                }

                if(this.hasClass('v_1') || this.hasClass('v_2')){

                    choice = false;
                    
                    var lastVideo = $('#'+this.id());
                    var lastVideoConteiner = lastVideo.parent();

                    lastVideo.removeClass('active');
                    lastVideo.addClass('hide');

                    lastVideoConteiner.removeClass('active');
                    lastVideoConteiner.addClass('hide');

                    if(lastVideoConteiner.hasClass('scene_2')) startFirstGame();
                    if(lastVideoConteiner.hasClass('scene_3')) startSecondGame();
                    if(lastVideoConteiner.hasClass('scene_4')) startThirdGame();
                    if(lastVideoConteiner.hasClass('scene_5')) startFourthGame();

                }

            });
            //return;
        });
    });

    
    $('.button_game_again').click(function(){
        var gameEndID = $('.game_end').attr('id');
        if(gameEndID == 'game_1') {
            changeTotalMoney(-money[1].game);
            startFirstGame();
        }
        else if(gameEndID == 'game_2') {
            changeTotalMoney(-money[2].game);
            startSecondGame();
        }
        else if(gameEndID == 'game_3') {
            changeTotalMoney(-money[3].game);
            startThirdGame();
        }
        else if(gameEndID == 'game_4') {
            changeTotalMoney(-money[4].game);
            startFourthGame();
        }
        $('.game_end').fadeOut(0);
    });

    $('.button_game_continue').click(function(){
        var gameEndID = $('.game_end').attr('id');
        if(gameEndID == 'game_1') {
            $('.game_1').fadeOut(0);
            playScene('scene_3');
        }
        else if(gameEndID == 'game_2') {
            $('.game_2').fadeOut(0);
            playScene('scene_4');
        }
        else if(gameEndID == 'game_3') {
            $('.game_3').fadeOut(0);
            playScene('scene_5');
        }
        else if(gameEndID == 'game_4') {
            $('.game_4').fadeOut(0);
            playScene('scene_6');
        }
        $('.game_end').fadeOut(0);
    });

    $('.button_scenes').click(function() {
        $('.navigation').fadeIn(0);
        var currentVideo = findVideoById($('.active > .active').attr('id'));
        currentVideo.vPlayer.pause();
    });

    $('.navigation > .close').click(function() {
        $('.navigation').fadeOut(0);
        var currentVideo = findVideoById($('.active > .active').attr('id'));
        currentVideo.vPlayer.play();
    });


//$('.game_1').fadeIn(0);
        //startFirstGame();
    $('.button_info').click(function() {
        
    });

    $('.navigation > div > div').click(function() {
        if(!$(this).hasClass('lock')){

            choice = false;
            var sClass = $(this).attr('class').split(' ')[0];
            var scene = $('.videos').find('.'+ sClass);

            var nextVideo = findVideoBySceneAndType(sClass, 'v_main');

            var currentVideo = findVideoById($('.active > .active').attr('id'));
            console.log(currentVideo.scene, sClass);
            if(currentVideo.scene == sClass){
                $(this).parent().parent().hide();
                currentVideo.vPlayer.play();
            } else{

            currentVideo.vPlayer.pause();
            currentVideo.vPlayer.currentTime(0);

            currentVideo.vJQuery.removeClass('active');
            currentVideo.vJQuery.addClass('hide');

            var currentScene = $('.videos > .active');

            currentScene.removeClass('active');
            currentScene.addClass('hide');

            scene.removeClass('hide');
            scene.addClass('active');

            var nextScene = Number($(this).attr('class').split(' ')[0].slice(6,7))-1;
            changeTotalMoney(-money[nextScene].amount);
            changeTotalMoney(-money[nextScene].ch_1);
            changeTotalMoney(-money[nextScene].ch_2);
            money[nextScene].hasChange = false;
            money[nextScene].hasChoiceChange = false;

            nextVideo.vJQuery.removeClass('hide');
            nextVideo.vJQuery.addClass('active');
            nextVideo.vPlayer.play();
            $(this).parent().parent().hide();
            }
        }
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