//Игра - Очисти ленту от ненужных покупок
var purchases = [], buyLine;
var purchaseSpeed = 0.2, numberPurchasesInHeight = 3, betweenPurchases = 1.2, percentNeccecary = 40;

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

function createPurchase(){
    var purchase = {
        number: 2,
        isUnnecessary: random(0,100) < percentNeccecary ? 0 : 1,
        price: 0,
        url: '',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
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

    purchase.JQ.css('transform', 'translateX('+purchase.left+'vw)');


    if(purchase.isUnnecessary){
        purchase.JQ.addClass('unnecessary');
    }
    return purchase;
}

function recreatePurchase(purchase){
    purchase.isBought = false;
    purchase.width = purchase.JQ.width();
    purchase.height = purchase.JQ.height();
    purchase.isUnnecessary = random(0,100)< percentNeccecary ? 0 : 1;

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

    purchase.JQ.find('img').attr('src', purchase.url);
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
    purchase.JQ.css('transform', 'translateX('+purchase.left+'vw)');
    purchase.JQ.css('top', purchase.top+'%');

    return purchase;
}

function checkPurchaseTouchBuyLine(purchase) {
    if (collision(purchase.JQ, buyLine.JQ)) {
        var left = parseInt(purchase.JQ.position().left);
        if (left < buyLine.left) {
            return true;
        }
    }
    return false;
}

function purchaseMove(purchase) {
    purchase.left += purchaseSpeed;
    if(purchase.left > -11){
        purchase.JQ.css('transform', 'translateX('+purchase.left+'vw)');
    }
    return purchase;
}

function startSecondGame(){

    $('.game_2').fadeIn(0);
    $('.navigation > div > .game_2').removeClass('lock');

    buyLine = {
        JQ: $('.buy_line'),
        width: $('.buy_line').width(),
        left: $('.buy_line').position().left,
        top: $('.buy_line').position().top 
    }

    var buyTotal = 0, isPlaying = true;

    money[2].game = 0;
    countNecessary = 0;
    buyTotal = 0;
    purchases = [];
    purchaseSpeed = 0.2;
    $('.purchases_box').empty();

    var anim_id;

    var timer = $('.game_2').find('.timer_line');
    timer.animate({
        width: '100%'
    }, timeForGame*1000);
    setTimeout(function(){

        timer.finish();
        timer.css('width', 0);
        if(isPlaying) {
        isPlaying = false;
            cancelAnimationFrame(anim_id);
            showGameEndWindow('game_2', 'За время игры ты купил художественных товаров</br>на '+(buyTotal+money[2].game)+' из 1000 рублей: '+countNecessary+' шт.</br></br>А также других товаров на '+money[2].game+' руб.');
        }
    }, timeForGame*1000);

    for(i=0; i<12; i++){
        purchases.push(createPurchase());
    }

    var the_game = 0;
    the_game = function () {
        $.each(purchases, function(){
            var purchase = this;
            purchase = purchaseMove(purchase);

            if(purchase.isBought && purchase.left > 100){
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
                        if(totalMoney-purchase.price<0){
                            isPlaying = false;
                            cancelAnimationFrame(anim_id);
                             showGameEndWindow('game_2', 'Закончились все деньги в кошельке.</br></br>За время игры ты купил художественных товаров</br>на '+(buyTotal+money[2].game)+' из 1000 рублей: '+countNecessary+' шт.</br></br>А также других товаров на '+money[2].game+' руб.');
                        }
                        changeTotalMoney(-purchase.price);
                        money[2].game-=purchase.price;
                    } else {
                        if(buyTotal+money[2].game+purchase.price > 1000){
                            changeTotalMoney(-purchase.price);
                            money[2].game-=purchase.price;
                        }
                        countNecessary++;
                    }
                } 
            }
        });
        
        if(isPlaying) requestAnimationFrame(the_game);
        
    };

    setInterval(function(){
        purchaseSpeed +=0.025;
    }, 5000);

    $('.purchases_box > div').click(function(){
        var purchase = findObjByJQ(purchases, $(this));
        console.log(purchase);    
        purchases.splice(purchases.indexOf(purchase),1);
        purchases.push(recreatePurchase(purchase));
    });

    anim_id = requestAnimationFrame(the_game);
}