
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
            'durationDisplay': true,
            'currentTimeDisplay': false,
            'fullscreenToggle': false,
            'pictureInPictureToggle': false,
            'remainingTimeDisplay': false,
        
      }, "fluid": true
    });
    videoj.dimensions(window.width, window.height);

    return videoj;
}


function playVideo(video, lastVideo) {
    var vClass = video.attr('class').slice(0, video.attr('class').indexOf(' '))
    var cClass = video.parent().attr('class').slice(0, video.parent().attr('class').indexOf(' '));
    var nextVideo;
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
    console.log("!!!", lastVideo, video, nextVideo);
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

//Игра - сформулируй цели
var percentIncome = 50, countGoals = 10, positionMultiplicity=20, maxTime = 7, numberCollectIncome=0, numberCollectCost=0, prizeTotal, prize = 50, isPlaying4 = true;
var goals = [];
var notesData = [
[{text: 'Набор карандашей', amount: -100},
    {text: 'Мороженое и сок', amount: -100},
    {text: 'Шоколадка', amount: -50},
    {text: 'Стикеры', amount: -50},
    {text: 'Перекусы в школе', amount: -200}]
,
    [{text: 'Карманные деньги', amount: 250},
    {text: 'От бабушки', amount: 100},
    {text: 'На школьные обеды', amount: 300},
    {text: 'За помощь по дому', amount: 150}]
];

var cellsData = [
    {top: 0, left: 130},
    {top: 0, left: 690},
    {top: 0, left: 1250},
    {top: 340, left: 130},
    {top: 340, left: 690},
    {top: 340, left: 1250}];

function createGoal(number){
    var goal = {
        isFprmulated: false,
        number: number,
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        JQ: $('')
    };


    goal.JQ = $('.goals_all > div:nth-child('+number+')');
    goal.JQ.find('.goal_text').html('Цель '+number);
    

    goal.JQ.css('opacity', 0);
    goal.JQ.css('transform', 'scale(0)');



    goal.width = goal.JQ.width();
    goal.height = goal.JQ.height();



    return goal;
}


function startThirdGame(){

    $('.game_3').fadeIn(0);

    var timer = $('.game_3').find('.timer_line');
    timer.animate({
        width: '100%'
    }, timeForGame*1000);
    setTimeout(function(){
        timer.finish();
        timer.css('width', 0);
        isPlaying3 = false;
        $('.game_window > .text').html('За время игры ты зафиксировал '+numberCollectIncome+' шт. доходов и '+numberCollectCost+' шт. расходов. В качестве награды ты заработал '+money[3].game+' руб.');
        $('.game_window').fadeIn(0);
    }, timeForGame*1000);


    for(i = 0; i<countGoals; i++){
        $('.goals_all').append($('<div class="note"><div class="note_text"></div><div class="note_amount"></div></div>'));
        goals.push(createGoal(i+1));  
    }
    console.log(goals);


}

$(document).ready(function() {

    choice = false;
    autoChoice = false;
    timeForChoice = 5;
    timeForGame = 30;

    videojsPlayers = [];
    videos = [];

            startThirdGame();

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

       player.on('play', function(){
            
 //           $('.navigation > .'+ videoData.scene).removeClass('lock');
           player.on('timeupdate', function(){
                var videoData = findVideoById(this.id());
                var currentScene = Number(videoData.scene.slice(6,7));
                            if(this.hasClass('v_main') && !money[currentScene-1].hasChange){
                            totalMoney += money[currentScene-1].amount;
            console.log(totalMoney,  money[currentScene-1].amount);    
            $('.total_money').html(totalMoney);
            money[currentScene-1].hasChange = true;
            }
            
            if(!money[currentScene-1].hasChoiceChange){
            if(this.hasClass('v_1')){
                totalMoney += money[currentScene-1].ch_1;
                console.log(totalMoney,  money[currentScene-1].ch_1);
                            
            money[currentScene-1].hasChoiceChange = true;
            }
            if(this.hasClass('v_2')){
                totalMoney += money[currentScene-1].ch_2;
                console.log(totalMoney,  money[currentScene-1].ch_2);
            money[currentScene-1].hasChoiceChange = true;
            }
$('.total_money').html(totalMoney);
            }
        });


            
            player.on('ended', function(){
                var videoData = findVideoById(this.id());

                var currentScene = Number(videoData.scene.slice(6,7));
                videoHTML = $('#'+this.id());
                console.log(videoData, this, '111', videoHTML);
                if(this.hasClass('v_main') && !videoHTML.parent().hasClass('scene_1')) {
                    setTimeout(function(){
                        if(!choice){
                            choice = true;
                            $(videoHTML.parent().find('.ch_1')).trigger('click');
                        }
                        }, timeForChoice*1000);
                    if(!choice) {
                        videoHTML.parent().find('.choice').fadeIn(0);
                        var timer = videoHTML.parent().find('.timer_line');
                        timer.animate({
                            width: '100%'
                        }, timeForChoice*1000);

                    }
                    

                }

                if(this.hasClass('v_1') || this.hasClass('v_2') || videoHTML.parent().hasClass('scene_1')){
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
                        if(currentScene == 5){

                             if(totalMoney>5000) nextVideo = nextVideoContainer.find('.v_1');
                             else if(totalMoney>2000) nextVideo = nextVideoContainer.find('.v_2');
                            else if(totalMoney>400) nextVideo = nextVideoContainer.find('.v_3');
                            else nextVideo = nextVideoContainer.find('.v_4');
                        }
                        var nextVideoJS = findVideoById(nextVideo.attr('id')).vPlayer;
/*
                        var vClass = nextVideo.attr('class').slice(0, nextVideo.attr('class').indexOf(' '));
                        var cClass = nextVideo.parent().attr('class').slice(0, nextVideo.parent().attr('class').indexOf(' '))
                        
                        $.each(videos, function () {
                            var player = this.vPlayer;
                            if(player.hasClass(vClass) && $('#'+player.id()).parent().hasClass(cClass)){
                                nextVideoJS = player;
                            }

                        });*/
                        nextVideoContainer.addClass('active');
                        nextVideoContainer.removeClass('hide');
                        
                        nextVideo.addClass('active');
                        nextVideo.removeClass('hide');
                        
                        //nextVideoJS.load();
                        $.each(videos, function () {
                            this.vPlayer.pause();

                        });
                        nextVideoJS.play();
                        
                    }
                }

            });
            //return;
        });
    });




    $('.button').click(function() {
        $('.navigation').fadeIn(0);
    });


//$('.game_1').fadeIn(0);
        //startFirstGame();
    $('.button_game').click(function() {
        startSecondGame();
    });

    $('.navigation > div').click(function() {
        if(!$(this).hasClass('lock')){

            choice = false;
            var sClass = $(this).attr('class').split(' ')[0];
            var scene = $('.videos').find('.'+ sClass);

            var nextVideo = findVideoBySceneAndType(sClass, 'v_main');

            var currentVideo = findVideoById($('.active > .active').attr('id'));
            console.log(currentVideo.scene, sClass);
            if(currentVideo.scene == sClass){
                $(this).parent().hide();
                
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
            $(this).parent().hide();
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