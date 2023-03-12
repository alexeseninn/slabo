let newGameButton = document.getElementById('game');
//флаг для определения очередности нажатия кнопки
let newButtonClicked = true;
newGameButton.onclick = start;

//счетчик шагов
let moveCounter = 0;

let player = new Array();
let genders = new Array();
let roles = new Array();
let task = new Array(); //вопросы без рп
let tasks = new Array(); //вопросы с рп

class Task {
    constructor(name, was, role) {
		this.name = name;
        this.was = was;
        this.role = role;
	}
	getName() {
		return this.name;
	}
}

function fillTasks(){
    tasks = [
        new Task('Игрок ' + player[killer] + ' 10 раз присядет над вашим лицом', 0),
        new Task('Выбираешь второго человека справа, вы набираете в рот воды и сидите друг напротив друга минуту. Проиграли - поджопники друг другу', 0),
        new Task('Вы должны выбрать одну любую песню и спеть её (подпевать можно)', 0),
        new Task('Выбери человека, вы должны съесть вдвоём печенье, без рук', 0),
        new Task('Полностью обнюхай третьего соседа слева', 0),
        new Task('Потрогай все попы и скажи, у кого самая аппетитная', 0),
        new Task('Все игроки игнорируют тебя один круг, что бы ты ни делал', 0, 'outguy'),
        new Task('Игрок ' + player[killer] + ' пробивает тебе пресс', 0),
        new Task('Выйди из комнаты на минуту', 0, 'outguy'),

        new Task(player[killer] + ' делает тебе больно (как хочет)', 0),
        new Task('Сядь на колени третьему игроку слева', 0, 'outguy'),
        new Task('Облизни палец игрока справа', 0),
        new Task('Поставь сливу игроку слева', 0),
        new Task('Выйди из комнаты на минуту', 0, 'outguy'),
        new Task('Игрок напротив ставит тебе щелбан', 0),
        new Task('Делаешь массаж ног игроку ' + player[massager1], 0, 'massager2'),
        new Task('Делаешь массаж спины игроку ' + player[massager2], 0, 'massager1')
    ];
}

//срабатывает при нажатии на кнопку новой игры
function start() {
    if (newButtonClicked) {
        if (player.length < 2)
            return;
        if (player.length > 4)
            startGameRP();
        else
            startGame();    
        startResults();
        newButtonClicked = false; //меняется значение флага
        newGameButton.innerHTML = "Restart";
        players.style.display = "none";
        difficulty.style.display = "none";
        playersList.style.display = "none";
        result.style.display = "block";
        field.style.display = "block";

    } else {
        window.location.reload(); //перезагрузит страницу
    }
}

// если игра с рп
function startGameRP() {
    rolePlay();
    fillTasks();
    tasks = shufflet(tasks);

    const field = document.querySelector('.field');

    const cell = document.createElement('div');
    let value = "Start game";
    cell.className = 'cell';
    cell.innerHTML = value;
    
    field.append(cell);
    let outguyQst = new Array; 
    let cc = 0, taskCounter = 0, buff = 0;
    let ms1tsk, ms2tsk;

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].role == 'massager1'){
            ms1tsk = tasks[i].name;
            tasks[i].was = 1;
        }
        if (tasks[i].role == 'massager2'){
            ms2tsk = tasks[i].name;
            tasks[i].was = 1;
        }
        if (tasks[i].role == 'outguy'){
            outguyQst[buff] = tasks[i].name;
            tasks[i].was = 1;
            buff++;
        }
    }

    buff = 0;

    cell.addEventListener('click', () => {

        if ((taskCounter == tasks.length)&&(taskCounter > 0)) {
            alert("Game over");
            window.location.reload();
        }

        if (((moveCounter % player.length) == massager1)&&(ms1tsk != 0)){
            value = ms1tsk;
            ms1tsk = 0;
        }
        else{
            if (((moveCounter % player.length) == massager2)&&(ms2tsk != 0)){
                value = ms2tsk;
                ms2tsk = 0;
            }
            else {
                if ((((moveCounter) % player.length) == outguy)&&(cc < outguyQst.length)){
                    value = outguyQst[cc++];
                }
                else{
                    if(tasks[taskCounter].was == 0){
                        value = tasks[taskCounter].name;
                        taskCounter++;
                    }
                    else{
                        while (tasks[taskCounter].was == 1) taskCounter++;
                        value = tasks[taskCounter].name;
                        taskCounter++;
                    }
                }
            }
        }
        moveCounter++;
        cell.innerHTML = value;
    })
}

//если игра без рп
function startGame() {
    fill(task);
    task = shuffle(task);
    
    const field = document.querySelector('.field');

    const cell = document.createElement('div');
    let value = "Start game";
    cell.className = 'cell';
    cell.innerHTML = value;
    
    field.append(cell);
    
    cell.addEventListener('click', () => {

        if ((moveCounter == task.length)&&(moveCounter > 0)) {
            alert("Game over");
            window.location.reload();
        }

        value = task[moveCounter];
        moveCounter++;
        cell.innerHTML = value;
    })
}

let massager1, massager2, outguy, killer;

function rolePlay() {
    
    for (let i = 0; i < genders.length; i++){
        if (genders[i] == "female"){
            massager1 = i;

            massager2 = massager1;
            while ((massager2 == massager1)||(genders[massager1] == genders[massager2])){
                massager2 = Math.floor(Math.random() * (player.length - 1));
            }

            killer = massager1;
            while ((killer == massager2)||(killer == massager1)){
                killer = Math.floor(Math.random() * (player.length - 1));
            }

            outguy = killer;
            while ((outguy == massager2)||(outguy == massager1)||(outguy == killer)){
                outguy = Math.floor(Math.random() * (player.length - 1));
            }

            return;
        }
    }    

    outguy = Math.floor(Math.random() * (player.length - 1));
    killer = outguy;
    while (killer == outguy){
        killer = Math.floor(Math.random() * (player.length - 1));
    }
}

//перемешать вопросы
function shuffle(arr) {

    let randomIndex, randomIndex2, buff;

    for (let i = 0; i < 100; i++){
        randomIndex = Math.floor(Math.random() * task.length);
        randomIndex2 = Math.floor(Math.random() * task.length);
        buff = arr[randomIndex];
        arr[randomIndex] = arr[randomIndex2];
        arr[randomIndex2] = buff;
    }
    
    return arr;
}

function shufflet(arr) {

    let randomIndex, randomIndex2;
    let buff = new Task('gay');

    for (let i = 0; i < 100; i++){
        randomIndex = Math.floor(Math.random() * tasks.length);
        randomIndex2 = Math.floor(Math.random() * tasks.length);
        buff = arr[randomIndex];
        arr[randomIndex] = arr[randomIndex2];
        arr[randomIndex2] = buff;
    }
    
    return arr;
}

//результаты
function startResults() {
    const moveContainer = document.querySelector('.move-text');
    const timeContainer = document.querySelector('.time-text');
    moveContainer.innerHTML = '' + moveCounter;
    timeContainer.innerHTML = 'none';
    //номер вопроса
    const movesUpdate = setInterval(
        () => {
            moveContainer.innerHTML = '' + moveCounter;
        },
        100);
    //имя текущего игрока
    const gameInterval = setInterval(
        () => {
            timeContainer.innerHTML = '' + player[(moveCounter - 1) % player.length];
        },
        1000);
}

function fill(arr){
    arr[0] = "Выберите игрока, который 10 раз присядет над вашим лицом";
    arr[1] = "Выбираешь человека, вы набираете в рот воды и сидите друг напротив друга минуту. Проиграли - поджопники друг другу";
    arr[2] = "Вы должны выбрать одну любую песню и спеть её (подпевать можно) ";
    arr[3] = "Выбери человека, вы должны съесть вдвоём печенье, без рук";
    arr[4] = "Полностью обнюхай третьего соседа слева";
    arr[5] = "Потрогай все попы и скажи, у кого самая аппетитная";
    arr[6] = "Отожмись 10 раз с человеком противоположного пола на спине, или заставь его отжаться с тобой на спине";
    arr[7] = "Зачитай человеку противоположного пола романтический стих";
    arr[8] = "Второй игрок справа делает тебе Мокрый Вилли";
    arr[9] = "Общайся пока до тебя опять не дойдет очередь только с английским акцентом";
    arr[10] = "Сядь на колени к кому-нибудь, сидеть нужно лицом к лицу, спроси как у него дела";
    arr[11] = "Помассируй ступни игроку напротив";
    arr[12] = "Подними человека своего пола (справа) и поставь ему засос на шее";
    arr[13] = "Понюхай всех и найди самого вкусного";
    arr[14] = "Говори до следующего хода фальцетом";
    arr[15] = "Поменяйтесь одним предметом одежды с третьим человеком справа";
    arr[16] = "Облизни запястье второго человека справа";
    arr[17] = "Второй сосед слева дает тебе поджопник";
    arr[18] = "Лизни лицо соседа справа";
    arr[19] = "Игрок справа пробивает тебе живот";
}

let newPlusButton = document.getElementById('addButton');
newPlusButton.onclick = newPlayer;

// тут про заполнение инфы об игроках
var counter = 0;
let gender;

document.addEventListener('keydown', function(event) {
    if (event.code == 'Enter') {
        newPlayer();
    }
});

function ad(){
    alert("u gay");
}
    
// если нажмется кнопка Enter
function newPlayer(){
    // получаем новое значение
    const elemText = document.querySelector('.textInput');
    if (elemText.disabled || !elemText.value.length) {
        return;
    }
    hint.style.display = "none";
    var val = elemText.value; 
    elemText.value = '';
    gender = document.querySelector('[name="gender"]:checked').value;
    genders[counter] = gender;
    player[counter++] = val;

    document.querySelector('.players_items').insertAdjacentHTML('beforeend', create(val));
}

//вызывается из onchange()
function create(text) {
    const date = JSON.stringify({ add: new Date().toLocaleString().slice(0, -3) });
    return `<li class="todo__item" data-todo-state="active">
            <span>Игрок №${counter} ${text}</span>`;
}

document.getElementById("clearButton").onclick = function(e) {
    document.getElementById("textInput").value = "";
}

// обработка потери фокуса
var keyBox = document.search.key;

function onblur(e){
    
    // получаем его значение и обрезаем все пробелы
    var text = keyBox.value.trim();
    if(text==="")
        keyBox.style.borderColor = "red";
    else
        keyBox.style.borderColor = "green";
}
// получение фокуса
function onfocus(e){
    
    // установка цвета границ поля
    keyBox.style.borderColor = "blue";
}
keyBox.addEventListener("blur", onblur);
keyBox.addEventListener("focus", onfocus);

document.getElementById('form').addEventListener('submit', function(e) {
    search(document.getElementById('inputText'));
    e.preventDefault();
}, false);