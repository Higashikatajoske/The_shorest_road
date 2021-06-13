//объявление переменных связанных с html-кодом
const answer = document.getElementById('answer');
const btn = document.getElementById('btn');
const widthText = document.getElementById('width');
const heightText = document.getElementById('height');
const countOfNumText = document.getElementById('numbers');

//объявление глобальных переменных
var height;
var width;
var field = [];
//названия цветов для раскрасски квадратов
const palitra = ["red", "green", "black", "palevioletred", "blueviolet", "deepskyblue", "Gold", "midnightblue", "teal"];
var pointList = [];

//Класс точка
class Point
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
};

//Функция проверки входных данных на ошибки
function checkNumbers()
{
    clearField();
    width = widthText.value;
    height = heightText.value;
    let countOfNum = countOfNumText.value;
    let notNumCheck = /\D+/g;
    //Проверка на заполненность полей
    if (width == "" || height == "" || countOfNum == "")
    {
        warningMessage("Не все поля заполненны.");
    }
    //Проверка на нечисловые символы
    else if(notNumCheck.test(width) || notNumCheck.test(height) || notNumCheck.test(countOfNum))
    {
        warningMessage("В полях должны быть только числа");
    }
    //Проверка на формат рамки
    else if(width < 3 || width > 20 || height < 3 || height > 20)
    {
        warningMessage("Размер сетки может быть от 3х3 до 20х20.");
    }
    //Проверка на ввод чисел перемещения
    else if(countOfNum < 1 || countOfNum > 9)
    {
        warningMessage("Количество число может быть от 1 до 9.");
    }
    else
    {
        //Создание поля
        createField();
        //Генерация чисел
        createRandNumb(countOfNum);
        //Перемещение из точки 1 в точку Х
        reachPosition();
    }
}

//Вывод сообщения
function warningMessage(message)
{
    answer.style.color = "red";
    answer.textContent = message + " Введите числа в поля.";
}

//Очистка поля
function clearField()
{
    const container = document.getElementById('container');
    while (container.firstChild)
    {
        container.removeChild(container.lastChild);
    }
}

function createRandNumb(numbers)
{
    pointList = [];
    let col = 0;
    let row = 0;
    let point;
    //Цикл создаёт столько чисел сколько указал пользовать
    for (let i = 1; i <= numbers; i++)
    {
        let isPointEmpty = false;
        //Цикл работает пока не найдёт блок с нулевым элементов
        while (isPointEmpty == false)
        {
            //Случайно создаётся номер ряда и места
            col = Math.floor(Math.random() * width);
            row = Math.floor(Math.random() * height);
            if (field[row][col] == 0)
            {
                isPointEmpty = true;
                field[row][col] = i;
                point = new Point(row, col);
                pointList.push(point);
            }
        }
        //Окраска блока
        let id = 'row' + row + 'col' + col;
        const block = document.getElementById(id);
        block.style.background = palitra[i - 1];
        block.style.color = "white";
        //Изменение числа
        block.textContent = i.toString();
    }
    //console.log(pointList);
}

//Функция создания поля
function createField()
{
    //ищется контейнер
    const container = document.getElementById('container');
    answer.style.color = "black";
    answer.textContent = "";
    //Очищается массивное поле
    field.splice(0,field.length);
    //Создаётся элемент span который и является блоком
    let span = document.createElement('span');
    span.className = "block";
    span.innerText = "0";
    let cloneSpan;
    //Цикл заполнения сетку блоками
    for (let i = 0; i < height; i++)
    {  
        //массив добавляется в массивное поле
        let line = [];
        //создаётся абзац в который будут добавлять span
        let p = document.createElement('p');
        p.className = "line";   
        for (let j = 0; j < width; j++)
        {
            //клонируется span
            cloneSpan = span.cloneNode(true);
            //Каждому блоку присваивается свой id для лёгкого поиска его на странице
            cloneSpan.id = "row" + i.toString() + "col" + j.toString();
            p.appendChild(cloneSpan);
            line.push(0);
        }
        //абзац заполненный span добавляется в сетку
        container.appendChild(p);
        field.push(line);
    }
}

//Функция перемещения
function reachPosition()
{
    //Дистанция между текущей точкой и точкой назначения
    let distanceX = 0;
    let distanceY = 0;
    //Позиции
    let currentPos;
    let nextPos;
    //Количество шагов
    let countGap = 0;

    //Цикл перещения точки от блока i до i + 1
    for (let i=0; i < pointList.length - 1; i++)
    {
        //определяется текущая точка и следующая
        currentPos = pointList[i];
        nextPos = pointList[i + 1];
        //Пока текущая точка не дойдёт до следующей
        while(currentPos.x != nextPos.x || currentPos.y != nextPos.y)
        {
            distanceX = Math.abs(nextPos.x - currentPos.x);
            distanceY = Math.abs(nextPos.y - currentPos.y);
            //console.log("disX",distanceX, "disY", distanceY);
            
            //Если расстояние по горизонтали больше, то точка перемещается по ней
            if (distanceX > distanceY)
                //Если след. позиция правее
                if (nextPos.x > currentPos.x)
                    currentPos.x++;
                else
                    currentPos.x--;
            //Если нет то по вертиркали
            else
                //Если след. позиция ниже
                if (nextPos.y > currentPos.y)
                    currentPos.y++;
                else
                    currentPos.y--;

            //Если точка не на следующей позиции, то цвета блока меняется
            if (currentPos.x != nextPos.x || currentPos.y != nextPos.y)
                changeBlock(currentPos.x, currentPos.y, i);
            //Если на позиции то окрашивается в цвет номера
            else
                changeBlock(currentPos.x, currentPos.y, field[currentPos.x][currentPos.y] - 1);
            //Добавление хода
            countGap++;
        }
    }
    answer.textContent = "Количество ходов от клетки 1 до " + pointList.length + " равно - " + countGap + ".";
}

//Смена цвета блока
function changeBlock(x, y, colorNumb)
{
    let id = 'row' + x + 'col' + y;
    const block = document.getElementById(id);
    block.style.background = palitra[colorNumb];
    block.style.color = "white";
}

//Обработчик нажатий кнопки
btn.addEventListener('click', checkNumbers);