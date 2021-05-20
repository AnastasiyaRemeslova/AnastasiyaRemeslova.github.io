
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
        /*if(player.hasClass(vClass) && $('#'+player.id()).parent().hasClass(cClass)){
            nextVideo = player;
        }*/
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
        left: random($('.game_1_box').width()*0.1, $('.game_1_box').width()*0.9)/$('.game_1_box').width()*100,
        speed: random(2, 5),
        JQ: $('<div/>', {
        class: "coin"
    })
    }
    coin.top = coin.JQ.position().top;
    coin.JQ.css('left', coin.left + '%');
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
    if (collision(coin.JQ, $('.floor_line'))) {
        coin.top = parseInt(coin.JQ.css('top'));
        if (coin.top < $('.floor_line').position().top) {
            return true;
        }
    }
    return false;
}

function startFirstGame(){

    $('.game_1').fadeIn(0);

    moneyBox = {
        JQ: $('.money_box'),
        width: $('.money_box').width(),
        position: $('.money_box').position().left,
        top: $('.money_box').position().top 
    }


    var timer = $('.game_1').find('.timer_line');
    timer.animate({
        width: '100%'
    }, timeForGame*1000);
    setTimeout(function(){
        timer.finish();
        timer.css('width', 0);
        isPlaying = false;
        cancelAnimationFrame(anim_id);
        $('.game_window > .text').html('За время игры ты собрал '+money[1].game+' руб.');
        $('.game_window').fadeIn(0);
    }, timeForGame*1000);

    var coins = [];
    for(i = 0; i<10; i++){
        coins.push(createCoin());
    }

    var the_game = 0;
    the_game = function () {
        $.each(coins, function(){
        var coin = this;

        if (checkCoinTouchMoneybox(coin) || checkCoinTouchFloor(coin)) {
            coin.top = -10;
            coin.JQ.css('top', coin.top + '%');
            coin.left = random($('.game_1_box').width()*0.1, $('.game_1_box').width()*0.9);
            coin.JQ.css('left', coin.left);
            console.log($('.game_1').width(), coin);
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

var purchaseSpeed = 0.3;
var purchases = [], purchasesBought = [];
var numberPurchasesInHeight = 3, betweenPurchases = 1.2;

var buyLine;

var purchasesData = [
    [{price: 50, url: 'media/svg/purchase_n_1.svg'},
    {price: 100, url: 'media/svg/purchase_n_2.svg'},
    {price: 150, url: 'media/svg/purchase_n_3.svg'},
    {price: 200, url: 'media/svg/purchase_n_4.svg'}]
,

    [{price: 50, url: 'media/svg/purchase_un_1.svg'},
    {price: 100, url: 'media/svg/purchase_un_2.svg'},
    {price: 100, url: 'media/svg/purchase_un_4.svg'},
    {price: 150, url: 'media/svg/purchase_un_3.svg'}]

];

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
        number: 2,
        isUnnecessary: random(0,100)<40 ? 0 : 1,
        price: 0,
        url: '',
        top: 0,
        left: 0,
        width: 0,
        height:0,
        JQ: $(''),
        isBought: false
    }


do{
        var elementData = purchasesData[purchase.isUnnecessary][random(0,purchasesData[purchase.isUnnecessary].length-1)];
    purchase.price = elementData.price;
    purchase.url = elementData.url;
    if(!purchases.length) break;
}while(purchases[purchases.length-1].url == purchase.url);



    purchase.JQ = $('<div class="purchase"><img src="'+purchase.url+'"><div class="purchase_price">'+purchase.price+'</div></div>');

    $('.purchases_box').append(purchase.JQ);
    purchase.width = purchase.JQ.width();
    purchase.height = purchase.JQ.height();

    var prev, topNumber, prevNumber;
    if(purchases.length){
        prev = purchases[purchases.length-1];
        prevNumber = prev.number;
    } else {
        prevNumber = 2;
    }
do{
    topNumber = random(1,numberPurchasesInHeight);
}while(topNumber == prevNumber);

    if(purchases.length) {
        if(prev.number%2 == topNumber%2) {
            if(prev.number<=numberPurchasesInHeight/2) topNumber=prev.number+2;
            else topNumber=prev.number-2;
    }
}
    purchase.number = topNumber;
    purchase.top = ((($('.purchases_box').height()-numberPurchasesInHeight*purchase.height)*topNumber)/(numberPurchasesInHeight+1) + purchase.height*(topNumber-1))/$('.purchases_box').height()*100;

    purchase.JQ.css('top', purchase.top+'%');

if(purchases.length>2){
    if(prev.number%2 == purchase.number%2 && purchases[purchases.length-2].left != prev.left){
        purchase.left = prev.left;
    } else {
        purchase.left = prev.left - purchase.width*betweenPurchases/$('.purchases_box').width()*100;
    }
} else {
    purchase.left = (purchase.JQ.position().left - purchases.length*purchase.width*betweenPurchases)/$('.purchases_box').width()*100;
}
    
    purchase.JQ.css('left', purchase.left+'%');


    if(purchase.isUnnecessary){
        purchase.JQ.addClass('unnecessary');
    }
   // console.log(purchase);
    return purchase;
}

function recreatePurchase(purchase){
    purchase.isBought = false;
    purchase.width = purchase.JQ.width();
    purchase.height = purchase.JQ.height();

    purchase.isUnnecessary = random(0,100)<40 ? 0 : 1;

do{
    var elementData = purchasesData[purchase.isUnnecessary][random(0,purchasesData[purchase.isUnnecessary].length-1)];
    purchase.price = elementData.price;
    purchase.url = elementData.url;
    if(!purchases.length) break;
}while(purchases[purchases.length-1].url == purchase.url);
    
    purchase.JQ.removeClass('unnecessary');

    if(purchase.isUnnecessary){
        purchase.JQ.addClass('unnecessary');
    }

    purchase.JQ.find('img').attr('src', purchase.src);
    purchase.JQ.find('.purchase_price').html(purchase.price);
    console.log(purchase.JQ.find('img'), purchase.JQ.find('.purchase_price'))

    var topNumber = random(1,numberPurchasesInHeight);
    purchase.top = ((($('.purchases_box').height()-numberPurchasesInHeight*purchase.height)*topNumber)/(numberPurchasesInHeight+1) + purchase.height*(topNumber-1))/$('.purchases_box').height()*100;
    purchase.number = topNumber;
    prev = purchases[purchases.length-1];
    if(prev.number%2 == purchase.number%2 && prev.number != purchase.number && purchases[purchases.length-2].left != prev.left){

        purchase.left = prev.left;
    } else {

        purchase.left = prev.left - purchase.width*betweenPurchases/$('.purchases_box').width()*100;
    }
    purchase.JQ.css('left', purchase.left+'%');
    purchase.JQ.css('top', purchase.top+'%');


    return purchase;
}

function checkPurchaseTouchBuyLine(purchase) {
    if (collision(purchase.JQ, buyLine.JQ)) {
        var left = parseInt(purchase.JQ.css('left'));
        if (left < buyLine.left) {
            return true;
        }
    }
    return false;
}

function checkPurchaseOutsideWindow(purchase) {
    var gameWindow = $('.game_2');
    if (collision(purchase.JQ, gameWindow)) {
        purchase.left = parseInt(purchase.JQ.css('left'));
        if (purchase.left > gameWindow.width) {
            return true;
        }
    }
    return false;
}

function purchaseMove(purchase) {
    //purchase.left = purchase.JQ.position().left/$('.purchases_box').width()*100;
    purchase.left += purchaseSpeed;
    if(purchase.left < -11){
        
    } else{

        purchase.JQ.css('left', purchase.left +'%');
    }
    return purchase;
}

function changeTotalMoney(amount){
    var changeMoney = $('.change_money')
    if(amount<0){
        changeMoney.addClass('spend');
    }
        changeMoney.html(amount);
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

function startSecondGame(){

    $('.game_2').fadeIn(0);

    buyLine = {
        JQ: $('.buy_line'),
        width: $('.buy_line').width(),
        left: $('.buy_line').position().left,
        top: $('.buy_line').position().top 
    }

    var buyTotal = 0, isPlaying = true, countNecessary=0;

    var anim_id;

    var timer = $('.game_2').find('.timer_line');
    timer.animate({
        width: '100%'
    }, timeForGame*1000);
    setTimeout(function(){
        timer.finish();
        timer.css('width', 0);
        isPlaying = false;
        cancelAnimationFrame(anim_id);
        $('.game_window > .text').html('За время игры ты купил '+countNecessary+' шт. художественных товаров на '+(buyTotal+money[2].game)+' из 1000 рублей. А также других товаров на '+money[2].game+' руб.');
        $('.game_window').fadeIn(0);
    }, timeForGame*1000);


    for(i=0; i<12; i++){
        purchases.push(createPurchase());

    }
    console.log(purchases);
        
    fps = 60;
    var the_game = 0;
    the_game = function () {
        $.each(purchases, function(){
            var purchase = this;
            purchase = purchaseMove(purchase);

            if(purchase.isBought && purchase.left > 100){
                console.log(purchase.left);
                purchases.splice(purchases.indexOf(purchase),1);
                purchases.push(recreatePurchase(purchase));
                purchase = purchases[purchases.length-1];
                //return;
            }
                if (checkPurchaseTouchBuyLine(purchase)) {
                if(!purchase.isBought){
                    purchase.isBought = true;
                    buyTotal += purchase.price;
                    $('.buy_total').html(buyTotal+'.00');
                    if(purchase.isUnnecessary){
                        changeTotalMoney(-purchase.price);
                        money[2].game-=purchase.price;
                    } else {
                        countNecessary++;
                    }
                } 
            }
        });
        setTimeout(function(){
            if(isPlaying) requestAnimationFrame(the_game);
        }, 1000/fps);
        
    };

    setInterval(function(){
        purchaseSpeed +=0.05;
    }, 5000);

    $('.purchases_box > div').click(function(){
        var purchase = findObjByJQ(purchases, $(this));
        console.log(purchase);
        
        purchases.splice(purchases.indexOf(purchase),1);

        purchases.push(recreatePurchase(purchase));
 
    });

    anim_id = requestAnimationFrame(the_game);
}



$(document).ready(function() {

    choice = false;
    autoChoice = false;
    timeForChoice = 5;
    timeForGame = 30;

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

        startFirstGame();
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