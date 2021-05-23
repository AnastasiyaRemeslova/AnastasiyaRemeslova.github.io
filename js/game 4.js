//Игра - отследи доходы и расходы
var percentIncome = 50, countNotes = 6, positionMultiplicity=20, maxTime = 7, numberCollectIncome=0, numberCollectCost=0, prizeTotal, prize = 50, isPlaying4 = true;
var notes = [];
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

function createNote(number){
    var note = {
        isIncome: random(0,100) < percentIncome ? 1 : 0,
        number: 0,
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        text: '',
        amount: 0,
        isDisappeared: true,
        JQ: $('')
    };

    var elementData = notesData[note.isIncome][random(0,notesData[note.isIncome].length-1)];
    note.text = elementData.text;
    note.amount = elementData.amount;

    note.JQ = $('.notes_all > div:nth-child('+number+')');
    note.JQ.find('.note_text').html(note.text);
    

    note.JQ.css('opacity', 0);
    note.JQ.css('transform', 'scale(0)');

    if(note.isIncome) {
        note.JQ.addClass('income');
        note.JQ.find('.note_amount').html('+'+note.amount);
    }
    else {
        note.JQ.removeClass('income');
        note.JQ.find('.note_amount').html(note.amount);
    }

    note.JQ.removeClass('appear_animation');
    note.JQ.removeClass('disappear_animation');

    note.width = note.JQ.width();
    note.height = note.JQ.height();

    var parent = note.JQ.parent();

    note.number = number;

    note.left = (cellsData[note.number-1].left + random(0, 140))/1920*100;
    note.top = (cellsData[note.number-1].top + random(0, 80))/660*100;

    note.JQ.css('left', note.left+'%');
    note.JQ.css('top', note.top+'%');

    return note;
}

function recreateNote(note){
    note.isDisappeared = true;

    var elementData = notesData[note.isIncome][random(0,notesData[note.isIncome].length-1)];
    note.text = elementData.text;
    note.amount = elementData.amount;

    note.JQ = $('.notes_all > div:nth-child('+note.number+')');
    note.JQ.find('.note_text').html(note.text);
    

    note.JQ.css('opacity', 0);
    note.JQ.css('transform', 'scale(0)');

    if(note.isIncome) {
        note.JQ.addClass('income');
        note.JQ.find('.note_amount').html('+'+note.amount);
    }
    else {
        note.JQ.removeClass('income');
        note.JQ.find('.note_amount').html(note.amount);
    }

    note.JQ.removeClass('appear_animation');
    note.JQ.removeClass('disappear_animation');

    note.width = note.JQ.width();
    note.height = note.JQ.height();

    var parent = note.JQ.parent();

    note.left = (cellsData[note.number-1].left + random(0, 140))/1920*100;
    note.top = (cellsData[note.number-1].top + random(0, 80))/660*100;

    note.JQ.css('left', note.left+'%');
    note.JQ.css('top', note.top+'%');

    return note;
}

function disappearNote(note){
    note.JQ.removeClass('appear_animation');
    note.JQ.addClass('disappear_animation');
    note.isDisappeared = true;

    setTimeout(function(){
        var index = notes.indexOf(note);
        var newNote = recreateNote(note);
        notes[index] = newNote;
        note = notes[index];
        setTimeout(function(){
            if(isPlaying4){
                appearNote(note);   
            }
        }, random(1, maxTime)*1000);
    }, 1000); 
}

function appearNote(note){
    note.JQ.removeClass('disappear_animation');
    note.JQ.addClass('appear_animation');
        note.JQ.css('opacity', 1);
    note.JQ.css('transform', 'scale(1)');
note.isDisappeared = false;
    setTimeout(function(){

        if(isPlaying4 && !note.isDisappeared){
        disappearNote(note);
        }   
    }, random(3, 5)*1000);
}

function startFourthGame(){

    $('.game_4').fadeIn(0);

    var collectTotal = 0;
    var anim_id;

    var timer = $('.game_4').find('.timer_line');
    timer.animate({
        width: '100%'
    }, timeForGame*1000);
    setTimeout(function(){
        timer.finish();
        timer.css('width', 0);
        isPlaying4 = false;
        $('.game_window > .text').html('За время игры ты зафиксировал '+numberCollectIncome+' шт. доходов и '+numberCollectCost+' шт. расходов. В качестве награды ты заработал '+money[4].game+' руб.');
        $('.game_window').fadeIn(0);
    }, timeForGame*1000);


    for(i = 0; i<countNotes; i++){
        $('.notes_all').append($('<div class="note"><div class="note_text"></div><div class="note_amount"></div></div>'));
        notes.push(createNote(i+1));  
    }
    console.log(notes);

    $.each(notes, function(){
        var note = this;
        setTimeout(function(){
            appearNote(note);    
        }, random(1, maxTime)*1000);
            
    });

    $('.notes_all > div').click(function(){
        var note = findObjByJQ(notes, $(this));
        disappearNote(note);
            
        if(note.isIncome) numberCollectIncome++;
        else numberCollectCost++;
        changeTotalMoney(prize);
        money[4].game+=prize;
    });

}