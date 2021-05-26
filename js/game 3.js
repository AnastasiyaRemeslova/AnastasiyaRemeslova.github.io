//Игра - сформулируй цели
var countGoals = 20, numberClicks = 10, prizeGoal = 50;
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
        isFormulated: false,
        number: number,
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        strokeDashoffset: 1000,
        JQ: $('')
    };

    goal.JQ = $('.goals > li:nth-child('+number+') > .goal');
    goal.JQ.find('.goal_text').html('Цель '+number);
    goal.JQ.addClass('next_goal');

    //goal.JQ.css('strokeDashoffset', '1000%');

    goal.width = goal.JQ.width();
    goal.height = goal.JQ.height();

    return goal;
}


function startThirdGame(){

    changeTotalMoney(-money[3].game, false);
    money[3].game = 0;

    $('.game_3').fadeIn(0);
    $('.navigation > div > .game_3').removeClass('lock');

    var currentGoalNumber = 1;
    var isPlaying3 = true;

    money[3].game = 0;

    $('.goals').empty();

        for(i = 0; i<countGoals; i++){
        $('.goals').append($('<li><div class="goal"><div class="goal_bg"><div class="goal_text"></div><img src="media/svg/goal_bg.svg"/></div><div class="svg_box"><svg version="1.1" preserveAspectRatio="xMinYMin meet" viewBox="0 0 480 480"><path class="part_of_circle" d="M240,470c127,0,230-103,230-230S367,10,240,10"/><path class="part_of_circle" d="M240,470C113,470,10,367,10,240S113,10,240,10"/></svg></div></div></li>'));
        goals[i] = createGoal(i+1); 
        goals[i].isFormulated = false; 
    }

        goals[0].JQ.removeClass('next_goal');

    $('.goals').css('transform','translateX(37.5vw)');
    console.log(goals, goals.length, $('.goals'));

   // setTimeout(function(){




    var timer = $('.game_3').find('.timer_line');
    timer.animate({
        width: '100%'
    }, timeForGame*1000);
    setTimeout(function(){
        timer.finish();
        timer.css('width', 0);
        showGameEndWindow('game_3', 'За время игры ты сформулировал целей: '+(currentGoalNumber-1)+' шт.</br><br>В качестве награды ты заработал '+money[3].game+' руб.');
        isPlaying3 = false;
    }, timeForGame*1000);




    $('.button_formulate').click(function(){
        if(isPlaying3){
        var currentGoal = goals[currentGoalNumber-1];
        currentGoal.JQ.removeClass('next_goal');
        currentGoal.strokeDashoffset -= 150/numberClicks;
        currentGoal.JQ.find('.part_of_circle').animate({
            'strokeDashoffset':  currentGoal.strokeDashoffset+'%'
        }, 250, "linear", function(){

        });

                    if(currentGoal.strokeDashoffset == 850){
            currentGoal.isFormulated = true;
            currentGoalNumber++;
            currentGoal.JQ.addClass('formulated');
            var left = ($('.goals').position().left-currentGoal.JQ.width())/$('.goals_all').width()*100;
            $('.goals').css('transform','translateX('+left+'vw)');
            money[3].game += 50;
            changeTotalMoney(50, true);
        }
    }else{
        currentGoalNumber = 1;
        return;
    }
    });
   // },10000);
}