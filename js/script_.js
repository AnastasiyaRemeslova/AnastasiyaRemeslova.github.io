var videoActiveJS, choice, autoChoice;
var videojsPlayers;
var videos;
var fps = 30;
var timeForChoice, timeForGame;

var money = [
{scene: 1, amount: 200, hasChange: false, isCurrent: true, isFirstPlayScene: true},
{scene: 2, amount: 1500, isCurrent: false, isFirstPlayScene: true, ch_1: -1500, ch_2: 0, hasChange: false, choice: 0, game: 0},
{scene: 3, amount: 250, isCurrent: false, isFirstPlayScene: true, ch_1: -200, ch_2: -200 , hasChange: false, choice: 0, game: 0},
{scene: 4, amount: 300, isCurrent: false, isFirstPlayScene: true, ch_1: 0, ch_2: 0 , hasChange: false, choice: 0, game: 0},
{scene: 5, amount: 350, isCurrent: false, isFirstPlayScene: true, ch_1: 0, ch_2: -300, hasChange: false, choice: 0, game: 0},
{scene: 6, amount: 100, isCurrent: false, isFirstPlayScene: true, hasChange: false},
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
            "preload": "auto"
        
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

function changeTotalMoney(amount, isShow){
    var changeMoney = $('.change_money');

    if(amount==0) isShow = false;

        if(isShow){
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
    }
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

function fullScreen(element) {
          if(element.requestFullscreen) {
            element.requestFullscreen();
          } else if(element.webkitrequestFullscreen) {
            element.webkitRequestFullscreen();
          } else if(element.mozRequestFullscreen) {
            element.mozRequestFullScreen();
          }
        }

function supportsLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
} catch (e) {
    return false;
  }
}

function saveGameState() {
    if (!supportsLocalStorage()) { return false; }
    localStorage["total.money"] = totalMoney;
    for (var i = 0; i < 6; i++) {
        localStorage["scene." + (i+1) + ".hasChange"] = money[i].hasChange;
        localStorage["scene." + (i+1) + ".isCurrent"] = money[i].isCurrent;
        localStorage["scene." + (i+1) + ".isFirstPlayScene"] = money[i].isFirstPlayScene;
        localStorage["scene." + (i+1) + ".choice"] = money[i].choice;
        localStorage["scene." + (i+1) + ".game"] = money[i].game;
    }
    return true;
}

function resumeGame() {
    if (!supportsLocalStorage()) { return false; }
    totalMoney = parseInt(localStorage["total.money"]);
    for (var i = 0; i < 6; i++) {
        money[i].hasChange = (localStorage["scene." + (i+1) + ".hasChange"] == "true");
        money[i].isCurrent = (localStorage["scene." + (i+1) + ".isCurrent"] == "true");
        money[i].isFirstPlayScene = (localStorage["scene." + (i+1) + ".isFirstPlayScene"] == "true");
        money[i].hasChange = parseInt(localStorage["scene." + (i+1) + ".choice"]);
        money[i].game = parseInt(localStorage["scene." + (i+1) + ".game"]);

        if(money[i].isCurrent){
            $('.active').addClass('hide');
            $('.active').removeClass('aclive');
            playScene('scene_'+(i+1));
        }
    }

    $.each(money, function () {
        if(this.isCurrent){
            playScene('')
        }
    });
    return true;
}

$(document).ready(function() {

    choice = false;
    autoChoice = false;
    timeForChoice = 5;
    timeForGame = 1;

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

    videos[0].vPlayer.load();
    videos[1].vPlayer.load();

    $('.button_start').click(function(){
        //fullScreen(document.documentElement);
        //document.onkeydown = goFullscreen;
        $('.start_box').fadeOut();
        var firstVideo = findVideoById($('.scene_1 > .v_main').attr('id'));
        firstVideo.vPlayer.play();
    });

    var videoHTML;


    $.each(videos, function () {
 //       var videoData = this;
        var player = this.vPlayer;

        player.ready(function(){

        var isSet = false;
        var videoData = findVideoById(this.id());
            player.on('play', function(){
                $('.navigation > div > .'+ videoData.scene).removeClass('lock');
                var currentScene = Number(videoData.scene.slice(6,7));
                $.each(money, function () {
                    this.isCurrent = false;
                });
                money[currentScene-1].isCurrent = true;
                var isSet = false;

            });

           player.on('timeupdate', function(){

                var currentScene = Number(videoData.scene.slice(6,7));

                
                if(!isSet && !money[currentScene-1].isFirstPlayScene && this.hasClass('v_main')){
                    console.log(currentScene, money[currentScene-1].amount)
                    if(currentScene == 1 || currentScene == 6){
                        if(money[currentScene-1].hasChange) changeTotalMoney(-(money[currentScene-1].amount), false);
                    } else{
                        if(money[currentScene-1].choice == 0 && money[currentScene-1].hasChange) changeTotalMoney(-(money[currentScene-1].amount), false);
                        else if(money[currentScene-1].choice == 1) changeTotalMoney(-(money[currentScene-1].amount+money[currentScene-1].ch_1), false);
                        else if(money[currentScene-1].choice == 2) changeTotalMoney(-(money[currentScene-1].amount+money[currentScene-1].ch_2), false);
                        money[currentScene-1].choice = 0;
                    }
                    isSet = true;
                    money[currentScene-1].hasChange = false;   
                }


                
                if((this.hasClass('v_main')) && !money[currentScene-1].hasChange){
                    if($('#'+this.id()).parent().hasClass('scene_2')){
                        if(this.currentTime() > 8){
                            money[currentScene-1].hasChange = true;
                            changeTotalMoney(money[currentScene-1].amount, true);
                        }
                    } else{
                        money[currentScene-1].hasChange = true;
                        changeTotalMoney(money[currentScene-1].amount, true);
                    }
                }

            
                if(money[currentScene-1].choice == false){
                    if(this.hasClass('v_1')){
                        changeTotalMoney(money[currentScene-1].ch_1, true);
                        money[currentScene-1].choice = 1;
                    }
                    if(this.hasClass('v_2')){
                        if($('#'+this.id()).parent().hasClass('scene_5')){
                            if(this.currentTime() > 7){
                                changeTotalMoney(money[currentScene-1].ch_2, true);
                                money[currentScene-1].choice = 2;
                            }
                        } else{
                            changeTotalMoney(money[currentScene-1].ch_2, true);
                            money[currentScene-1].choice = 2;
                        }
                    }
                }
            });

            player.on('ended', function(){

                if(saveGameState()) console.log(localStorage);

                isSet = false;

                var currentScene = Number(videoData.scene.slice(6,7));
                money[currentScene-1].isFirstPlayScene = false;
                videoHTML = $('#'+this.id());
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
                else if(videoHTML.parent().hasClass('scene_6')){
                    $('.end_box').fadeIn(0);

                }
                else if(this.hasClass('v_1') || this.hasClass('v_2')){

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
            startFirstGame();
        }
        else if(gameEndID == 'game_2') {
            startSecondGame();
        }
        else if(gameEndID == 'game_3') {
            startThirdGame();
        }
        else if(gameEndID == 'game_4') {
            startFourthGame();
        }
        $('.game_end').fadeOut(0);
    });

    $('.button_game_continue').click(function(){
        var gameEndID = $('.game_end').attr('id');
        if(gameEndID == 'game_1') {
            $('body > .game_1').fadeOut(0);
            playScene('scene_3');
        }
        else if(gameEndID == 'game_2') {
            $('body > .game_2').fadeOut(0);
            playScene('scene_4');
        }
        else if(gameEndID == 'game_3') {
            $('body > .game_3').fadeOut(0);
            playScene('scene_5');
        }
        else if(gameEndID == 'game_4') {
            $('body > .game_4').fadeOut(0);
            playScene('scene_6');
        }
        $('.game_end').fadeOut(0);
    });

    $('.button_scenes').click(function() {
        $('.navigation_box').fadeIn(0);
        var currentVideo = findVideoById($('.active > .active').attr('id'));
        currentVideo.vPlayer.pause();
    });

    $('.navigation_box > .close').click(function() {
        $('.navigation_box').fadeOut(0);
        var currentVideo = findVideoById($('.active > .active').attr('id'));
        currentVideo.vPlayer.play();
    });


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

            nextVideo.vJQuery.removeClass('hide');
            nextVideo.vJQuery.addClass('active');
            nextVideo.vPlayer.play();
            $(this).parent().parent().parent().hide();
            }
        }
    })
});        