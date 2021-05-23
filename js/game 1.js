//Игра - Собери монетки в копилку

var moneyBox;
var numberCoinsInWidth = 6, betweenCoins = 2, percent10 = 75, coinSpeed = 3, countCoins = 15;
var coins = [];
var coinsData = [{price: 100, url: 'media/svg/money_100.svg'},
    {price: 10, url: 'media/svg/money_10.svg'}];

function createCoin(){
    var coin = {
        is10: random(0,100) < percent10 ? 1 : 0,
        isCollect: false,
        top: 0,
        left: '',
        width: 0,
        height: 0,
        number: 0,
        speed: 0,
        price: 0,
        url: '',
        JQ: ''
    };

    coin.price = coinsData[coin.is10].price;
    coin.url = coinsData[coin.is10].url;
    coin.JQ = $('<div class="coin"><img src="'+coin.url+'"></div>');
    coin.speed = coinSpeed;
    if(!coin.is10) coin.JQ.addClass('money_100');

    $('.coins_box').append(coin.JQ);
    coin.width = coin.JQ.width();
    coin.height = coin.JQ.height();

    coin.JQ.css('transform', 'translateY(-100%)');
    var prev;
    if(coins.length){
        prev = coins[coins.length-1];
        prevNumber = prev.number;
    } else {
        prevNumber = numberCoinsInWidth/2;
    }

var leftNumber;
do{
    leftNumber = random(1,numberCoinsInWidth);
    coin.number = leftNumber;
}while(coin.number == prevNumber);
    
    coin.left = ((($('.coins_box').width()-numberCoinsInWidth*coin.width)*leftNumber)/(numberCoinsInWidth+1) + coin.width*(leftNumber-1))/$('.coins_box').width()*100;
    coin.JQ.css('left', coin.left+'%');


    if(coins.length>1){
       //if((Math.abs(coin.number - prev.number)>1 || prev.number%2 == coin.number%2) && coins[coins.length-2].top!=prev.top){
           // coin.top = prev.top;
        //} else {
            coin.top = prev.top - coin.height*betweenCoins/coin.width*100;
       // }
    } else {
        coin.top = (coin.JQ.position().top - coins.length*coin.height*betweenCoins)/coin.width*100;
    }



    coin.JQ.css('transform', 'translateY('+coin.top+'%)');

    return coin;
}

var countOfRecreate=0;

function recreateCoin(coin){
    coin.isCollect = false;
    var leftNumber = random(1,numberCoinsInWidth);
    coin.number = leftNumber;
    coin.width = coin.JQ.width();
    coin.height = coin.JQ.height();
   
    countOfRecreate++;
    var prev = coins[coins.length - 1];
    if(countOfRecreate == 1 || countOfRecreate == countCoins+1 || countOfRecreate == 2*countCoins+1) {
        coin.top = -coin.top - 100 - coin.height*betweenCoins/coin.width*100;
        console.log(coin.top);

} else{
    coin.top = prev.top - coin.JQ.height()*betweenCoins/coin.JQ.width()*100;
}

    coin.JQ.css('transform', 'translateY('+coin.top+'%)');
    coin.left = ((($('.coins_box').width()-numberCoinsInWidth*coin.JQ.width())*leftNumber)/(numberCoinsInWidth+1) + coin.width*(leftNumber-1))/$('.coins_box').width()*100;
    coin.JQ.css('left', coin.left+'%');

    return coin;
}

function coinDown(coin) {
    coin.top += coin.speed;
    var parent = coin.JQ.parent();
    var coinTop = coin.top*coin.JQ.width()/100
    
    coin.JQ.css('transform', 'translateY('+coin.top+'%)');

    return coin;
}

function checkCoinTouchMoneybox(coin) {
    if (collision(coin.JQ, $('.money_box'))) {
        var left = coin.JQ.offset().left;
        var top = coin.JQ.offset().top;
        
        if (left > $('.money_box').offset().left && top < $('.money_box').offset().top && left+coin.JQ.width() < $('.money_box').offset().left+$('.money_box').width()) {
            return true;
        }
    }
    return false;
}

function checkCoinTouchFloor(coin) {
    var top = coin.JQ.offset().top;
    if (top > $('.floor_line').offset().top) {
        return true;
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

    var isPlaying = true, collectTotal = 0;
    var anim_id;

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


    for(i = 0; i<countCoins; i++){
            coins.push(createCoin());
        
    }
    console.log(coins);

    var the_game = 0;
    the_game = function () {
    $.each(coins, function(){
        var coin = this;
        coinDown(coin);

        if (checkCoinTouchMoneybox(coin)) {
            if(!coin.isCollect){
                coin.isCollect = true;
                collectTotal += coin.price;
                changeTotalMoney(coin.price);
                money[1].game+=coin.price;
                setTimeout(function(){
                    coin.JQ.animate({
                        opacity: '0'
                    }, 200, function(){
                            
                        });
                }, 200);
            } 

        }
        if(checkCoinTouchFloor(coin)){
            coins.splice(coins.indexOf(coin),1);
            coins.push(recreateCoin(coin));
            coin = coins[coins.length-1];
            coin.JQ.css('opacity', '100%');
            return;
        }
        });
        if(isPlaying) requestAnimationFrame(the_game);
    };


    anim_id = requestAnimationFrame(the_game);

    $('.money_box').draggable({
        axis: "x",
        containment: 'parent',
        stop: function(e, ui) {
            moneyBox.position = ui.position.left / $('.game_1').width() * 100;
            ui.helper.css('left', moneyBox.position + 'vw');
            moneyBox.top = ui.position.top / $('.game_1').width() * 100;
            ui.helper.css('top', moneyBox.top + 'vw');
        }
    });
}