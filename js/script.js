
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

var timeForChoice;

var money = [
{scene: 1, amount: 200, hasChange: false},
{scene: 2, amount: 1500, ch_1: -1500, ch_2: 0, hasChange: false, hasChoiceChange: false},
{scene: 3, amount: 250, ch_1: -200, ch_2: -200 , hasChange: false, hasChoiceChange: false},
{scene: 4, amount: 300, ch_1: 0, ch_2: 0 , hasChange: false, hasChoiceChange: false},
{scene: 5, amount: 350, ch_1: 0, ch_2: -300, hasChange: false, hasChoiceChange: false},
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

    lastVideo.parent().find('.timer_line').finish();
    lastVideo.parent().find('.timer_line').css('width', 0);

    video.removeClass('hide');
    video.addClass('active');
    nextVideo.load();
    nextVideo.play();
}

//Игра - Собери монетки в копилку

var moneyBox;

function random(min,max){
    return Math.round(Math.random() * (max-min) + min);
}

function collision($div1, $div2) {
    var x1 = $div1.position().left;
    var y1 = $div1.position().top;
    var h1 = $div1.outerHeight(true);
    var w1 = $div1.outerWidth(true);
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = $div2.position().left;
    var y2 = $div2.position().top;
    var h2 = $div2.outerHeight(true);
    var w2 = $div2.outerWidth(true);
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
}

function createCoin(){
    var coin = {
        top: '',
        left: random($('.game_1_box').width()*0.1, $('.game_1_box').width()*0.9),
        speed: random(2, 5),
        JQ: $('<div/>', {
        class: "coin"
    })
    }
    coin.top = coin.JQ.position().top;
    coin.JQ.css('left', coin.left);
    $('.game_1_box').append(coin.JQ);
    return coin;
}

function coinDown(coin) {
    coin.top = coin.JQ.position().top;
    coin.JQ.css('top', coin.top + coin.speed);
}

function checkCoinTouchMoneybox(coin) {
    if (collision(coin.JQ, moneyBox.JQ)) {
        coin.top = parseInt(coin.JQ.css('top'));
        if (coin.top < moneyBox.top) {
            return true;
        }
    }
    return false;
}

function checkCoinTouchFloor(coin) {
    if (collision(coin.JQ, $('.floor'))) {
        coin.top = parseInt(coin.JQ.css('top'));
        if (coin.top < $('.floor').position().top) {
            return true;
        }
    }
    return false;
}

function startFirstGame(){
    moneyBox = {
        JQ: $('.money_box'),
        width: $('.money_box').width(),
        position: $('.money_box').position().left,
        top: $('.money_box').position().top 
    }

    var coins = [];
    for(i = 0; i<10; i++){
        coins[i] = createCoin();
    }

    var the_game = 0;
    the_game = function () {
        $.each(coins, function(){
        var coin = this;

        if (checkCoinTouchMoneybox(coin) || checkCoinTouchFloor(coin)) {
            coin.top = 0;
            coin.JQ.css('top', coin.top);
            coin.left = random($('.game_1').width()*0.1, $('.game_1').width()*0.9);
            coin.JQ.css('left', coin.left);
        } else {
            coinDown(coin);
        }

        });
        requestAnimationFrame(the_game);
    };


    anim_id = requestAnimationFrame(the_game);
/*
    for (i = 0; i < 1; i++) { 
        dropCoin();
    }
    setInterval(function(){
        for (i = 0; i < 1; i++) { 
            dropCoin();
        }  
    }, 5000);
*/
/*
    moneyBox.JQ.parent().on("touchmove mousemove", function(event){
        if(event.pageX > 0 && event.pageX < $(this).width() - moneyBox.width){
            moneyBox.JQ.css('left', event.pageX);
            moneyBox.position = moneyBox.JQ.position().left;
        }
    });
    */
/*
        $('.coin').each(function(){
        console.log($(this).position().top + $(this).height(), moneyBox.top, $(this).position().left, moneyBox.position);
        if($(this).position().top + $(this).height() >= moneyBox.top){
            console.log("!!!!!!!!!");
            $(this).remove();
        }
    });*/
    $('.money_box').draggable({
        axis: "x",
        containment: 'parent',
        stop: function(e, ui) {
        var perc = ui.position.left / ui.helper.parent().width() * 100;
        ui.helper.css('left', perc + '%');
        var top = ui.position.top / ui.helper.parent().height() * 100;
        ui.helper.css('top', top + '%');
  }
    });
}

//Игра - Очисти ленту от ненужных покупок

var purchaseSpeed = 0.05;
var purchases = [];
var numberPurchasesInHeight = 5;

function findObjByJQ(array, JQ){
    var obj;
    $.each(array, function(){
        if(this.JQ.is(JQ)){
            obj = this;
        }
    });
    return obj;
}

function createPurchase(){
    var purchase = {
        isUnnecessary: random(0,1),
        top: 0,
        left: '',
        width: 0,
        height:0,
        JQ: $('<div/>', {class: "purchase"})
    }

    $('.purchases_box').append(purchase.JQ);
    purchase.width = purchase.JQ.width();
    purchase.height = purchase.JQ.height();
    var topNumber = random(1,numberPurchasesInHeight);
    purchase.top = ((($('.purchases_box').height()-numberPurchasesInHeight*purchase.height)*topNumber)/(numberPurchasesInHeight+1) + purchase.height*(topNumber-1))/$('.purchases_box').height()*100;
    purchase.left = (purchase.JQ.position().left - purchases.length*purchase.width*1.5)/$('.purchases_box').width()*100;
    purchase.JQ.css('left', purchase.left+'%');
    purchase.JQ.css('top', purchase.top+'%');

    if(purchase.isUnnecessary){
        purchase.JQ.addClass('unnecessary');
    }
    return purchase;
}

function recreatePurchase(purchase){
    purchase.width = purchase.JQ.width();
    purchase.height = purchase.JQ.height();
    purchase.isUnnecessary = random(0,1);
    var topNumber = random(1,numberPurchasesInHeight);
    purchase.top = ((($('.purchases_box').height()-numberPurchasesInHeight*purchase.height)*topNumber)/(numberPurchasesInHeight+1) + purchase.height*(topNumber-1))/$('.purchases_box').height()*100;
    console.log(purchases[purchases.length-1]);
    purchase.left = purchases[purchases.length-1].left - purchase.width*1.5/$('.purchases_box').width()*100;
    purchase.JQ.css('left', purchase.left+'%');
    purchase.JQ.css('top', purchase.top+'%');

    purchase.JQ.removeClass('unnecessary');
    if(purchase.isUnnecessary){
        purchase.JQ.addClass('unnecessary');
    }
    return purchase;
}

function purchaseMove(purchase) {
    purchase.left = purchase.JQ.position().left/$('.purchases_box').width()*100;
    purchase.JQ.css('left', purchase.left + purchaseSpeed +'%');
}

function startSecondGame(){


    for(i=0; i<10; i++){
            purchases.push(createPurchase());
            console.log(purchases);
            
    }
        

    var the_game = 0;
    the_game = function () {
        $.each(purchases, function(){
            var purchase = this;
            purchaseMove(purchase);
        });
        requestAnimationFrame(the_game);
    };

    setInterval(function(){
        purchaseSpeed +=0.0025;
    }, 2000);

    $('.purchases_box > div').click(function(){
        
        var lastPurchase = purchases.splice(purchases.indexOf(findObjByJQ(purchases, $(this))),1)[0];
        console.log(lastPurchase);
        purchases.push(recreatePurchase(lastPurchase));
 
    });

    anim_id = requestAnimationFrame(the_game);

    
}



$(document).ready(function() {

    choice = false;
    autoChoice = false;
    timeForChoice = 5;

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
        playVideo(video);
    });

    var videoHTML = $('.active > .active');

    $.each(videos, function () {
        var videoData = this;
        var player = this.vPlayer;
console.log(videoData);

        player.on('play', function(){

            videoHTML = $('.active > .active');
            $('.navigation > .'+ videoData.scene).removeClass('lock');

            var currentScene = Number(videoData.scene.slice(6,7));


            this.on('timeupdate', function(){
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


            
            this.on('ended', function(){
                var p =this;
                if(this.hasClass('v_main') && !videoHTML.parent().hasClass('scene_1')) {
                    setTimeout(function(){
                        if(!choice){
                        choice = true;
                        console.log(videoData);
                        $(videoData.vJQuery.parent().find('.ch_1')).trigger('click');
                    }
                    
                }, timeForChoice*1000);
                    if(!choice) {
                        videoData.vJQuery.parent().find('.choice').fadeIn(0);
                        var timer = videoData.vJQuery.parent().find('.timer_line');
                        timer.animate({
                            width: '100%'
                        }, timeForChoice*1000);

                    }
                    

                }

                if(this.hasClass('v_1') || this.hasClass('v_2') || videoHTML.parent().hasClass('scene_1')){
                    choice = false;
                    console.log(this);
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

                        var vClass = nextVideo.attr('class').slice(0, nextVideo.attr('class').indexOf(' '));
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
                        return;
                    }
                }
            });
        });
    });




    $('.button').click(function() {
        $('.navigation').fadeIn(0);
    });

//$('.game_1').fadeIn(0);
        //startFirstGame();
    $('.button_game').click(function() {
        $('.game_1').fadeIn(0);
        startFirstGame();
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