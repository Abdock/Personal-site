var doc = document, math = Math;
var block = doc.getElementById('block');
const random = (a, b) => { return math.random() * (b - a) + a; };
var w = block.clientWidth, h = block.clientHeight, r = 50;
var hx = w / (r * 2), hy = h / (r * 2);
var red = doc.createElement('div');
var points = [], was = new Array(w/r * h/r + 20);
var target = red;
var tx, ty;
var targetIndex;
var lose = false;
var win = false;
var field = new Array(w/r * h/r + 20);
var Coordinates = new Array(w/r * h/r + 20);
var redIndex;
var settingsIcon = doc.getElementById('settings-logo');
var settingsPage = doc.getElementById('settings-page');
var musicIcon = doc.getElementById('music-logo');
var infoIcon = doc.getElementById('info-logo');
var infoBlock = doc.getElementById('info');
var music = new Audio("../Music/ThisGamePianoCover.mp3");
var winIcon = doc.getElementById('win');
var loseIcon = doc.getElementById('lose');
var range = doc.getElementById('range');
var winOnPage = false;
var loseOnPage = false;
var timer;
var onPage = false;
var onPageInfo = false;
var defx = [0, 0, -1, 1, -1, 1, 1, -1];
var defy = [-1, 1, 0, 0, 1, -1, 1, -1];
var dx = [0, 0, -1, 1, -1, 1, 1, -1];
var dy = [-1, 1, 0, 0, 1, -1, 1, -1];
var startTime, endTime;
red.style.top = block.offsetTop + (hy - 1) * 50 + 'px';
red.style.left = block.offsetLeft + (hx - 1) * 50 + 'px';
red.id = 'hero';
doc.body.appendChild(red);

for(let i = 0; i < was.length; i++)
{
    was[i] = new Array(50);
    for(let j = 0; j < was[i].length; j++)
    {
        was[i][j] = 0;
    }
}

for (let i = 0; i < field.length; i++)
{
    field[i] = [];
}

function ctor(x, y)
{
    this.x = x;
    this.y = y;
}

function FindObjectOf(obj, array, comporator)
{
    for (let i = 0; i < array.length; i++)
    {
        if(comporator(obj, array[i]))
        {
            return i;
        }
    }
    return -1;
}

function inField(x, y)
{
    return (x >= 1 && y >= 1 && x <= w/r && y <= h/r);
}

function check(x, y)
{
    return (inField(x, y) && !was[x][y]);
}

function bfs(index)
{
    if(win)
    {
        return false;
    }
    let queue = [index];//Очередь для вершин до которых можно дайти
    let used = new Array(w/r * h/r + 20);//Массив чтобы помечать были ли мы в этой вершине
    used.fill(false);
    let d = new Array(w/r * h/r + 20), p = new Array(w/r * h/r + 20);//Расстояние из изходной точки хранятся в массиве 'd', а префиксные вершины в массиве p
    d.fill(0);
    while(queue.length)
    {
        let v = queue.shift();//берем вершину
        for (let i = 0; i < field[v].length; i++)//проверяем ее соседей
        {
            let to = field[v][i];
            if(!used[to] && check(Coordinates[to].x, Coordinates[to].y))//проверяем были ли мы в ней, и помечена ли она в массиве was и не выходит ли за границы поля
            {
                used[to] = true;//помечаем что были здесь
                queue.push(to);//добовляем в очередь
                d[to] = d[v] + 1;//расстояние от начала, это расстояние из прежнего узла + 1
                p[to] = v;//перфиксный узел
            }
        }
    }
    let finalPath = [];//для хранения самого короткого пути
    let choose = false;//был ли выбран элемент для краткого пути или нет
    for (let i = 0; i < used.length; i++)
    {
        if(used[i])//помечена ли вершина
        {
            let path = [];//массив пути
            for (let v = i/* выбираем номер вершины */; v != index /* пока вершина не равна той из которой мы начали путь продалжаем */; v=p[v] /* переходим к префиксной вершине */)
            {
                path.push(v);                //строим путь
            }
            path.reverse();//переворачиваем путь так как он строился от конца к началу
            if(points.indexOf(path[path.length - 1]) > -1)//проверяем ведет ли этот путь на одну из крайних точек массива
            {
                if(!choose)//проверяем был ли выбран хоть один путь, это для сравнения
                {
                    finalPath = path;
                    choose = true;
                }
                else if(finalPath.length > path.length)//проверяем длину пути, точнее является ли наш путь самым коротким
                {
                    finalPath = path;
                }
            }
        }
    }
    if(finalPath.length == 0)
    {
        winIcon.style.top = 'calc(50% - ' + winIcon.clientHeight/2 + 'px)';
        winOnPage = true;
        win = true;
        endTime = Date.now();
        localStorage.setItem(sessionStorage.getItem('user-name') + ' catch red', endTime - startTime);
        return false;
    }
    redIndex = finalPath[0];//выбирается самый первый узел который ближе к красной точке
    hx = Coordinates[redIndex].x;
    hy = Coordinates[redIndex].y;
}

function MoveRed()
{
    red.style.left = block.offsetLeft + (hx - 1) * r + 'px';
    red.style.top = block.offsetTop + (hy - 1) * r + 'px';
}

function drawField()//Рисуем поле
{
    let index = 1;
    for (let y = 1; y <= h/r; y++)
    {
        for (let x = 1; x <= w/r; x++)
        {
            if (x == 1 || y == 1 || x == math.floor(w / 50) || y == math.floor(h / 50))
            {
                points.push(index);//Сохраняем крайние точки для поиска
            }
            if(x == hx && y == hy)
            {
                redIndex = index;//По центру находится красная точка, сохраним и ее позицию для перемещения
            }
            let f = doc.createElement('div');
            f.className = 'field';
            f.style.left = block.offsetLeft + r * (x - 1) + 'px';
            f.style.top = block.offsetTop + r * (y - 1) + 'px';
            //создание и позиционирование элемента
            for (let i = 0; i < dx.length; i++)//Список смежности, с какими вершинами соеденен
            {
                if(inField(x + dx[i], y + dy[i]))
                {
                    field[index].push(index + dx[i] + dy[i] * w / r);//Если точка не выходит за границы просто сохраняем эту точку как сосед в списке
                }
            }
            Coordinates[index] = new ctor(x, y);//сохранение точки в матрице где хранятся точки

            if(math.round(random(0, 150)) <= 10)//Для поивления случайных черных точек
            {
                was[x][y] = true;
                f.style.backgroundColor = 'black';
                f.style.color = 'white';
            }
            index++;
            doc.body.appendChild(f);//вставляем блок
            f.onclick = function(){//при нажатий на блок происходит движение
                if(was[x][y] != 1 && !(hx == x && hy == y))
                {
                    if(!lose && !win)
                    {
                        was[x][y] = true;
                        f.style.backgroundColor = 'black';
                        f.style.color = 'white';
                        bfs(redIndex);//Запуск обхода в ширину
                        MoveRed();
                        if(points.indexOf(redIndex) > -1)
                        {
                            loseIcon.style.top = 'calc(50% - ' + loseIcon.clientHeight/2 + 'px)';
                            loseOnPage = true;
                            lose = true;
                            return false;
                        }
                    }
                    else if(lose)
                    {
                        loseIcon.style.top = 'calc(50% - ' + loseIcon.clientHeight/2 + 'px)';
                        loseOnPage = true;
                    }
                    else
                    {
                        winIcon.style.top = 'calc(50% - ' + winIcon.clientHeight/2 + 'px)';
                        winOnPage = true;
                    }
                }
            }
        }
    }
}

(function ()
{
    startTime = Date.now();
    if(localStorage.getItem('level') == 'hard')
    {
        dx = defx.slice(0);
        dy = defy.slice(0);
    }
    else if(localStorage.getItem('level') == 'normal')
    {
        dx = defx.slice(0, 6);
        dy = defy.slice(0, 6);
    }
    else if(localStorage.getItem('level') == 'easy')
    {
        dx = defx.slice(0, 4);
        dy = defy.slice(0, 4);
    }
    drawField();
})()

function changeMusic(src)
{
    music.src = src;
    music.play();
}

doc.getElementById('NoGameNoLife').onclick = function(event)
{
    changeMusic("../Music/ThisGamePianoCover.mp3");
    if(!onPage)
    {
        settingsPage.style.top = '5%';
    }
    else
    {
        settingsPage.style.top = '-550%';
    }
    onPage = !onPage;
}

doc.getElementById('Bleach').onclick = function(event)
{
    changeMusic("../Music/NeverMeantToBelongPianoCover.mp3");
    if(!onPage)
    {
        settingsPage.style.top = '5%';
    }
    else
    {
        settingsPage.style.top = '-550%';
    }
    onPage = !onPage;
}

doc.getElementById('DemonSlayer').onclick = function(event)
{
    changeMusic("../Music/End.mp3");
    if(!onPage)
    {
        settingsPage.style.top = '5%';
    }
    else
    {
        settingsPage.style.top = '-550%';
    }
    onPage = !onPage;
}

doc.getElementById('easy').onclick = function()
{
    localStorage.setItem('level', 'easy');
    dx = defx.slice(0, 4);
    dy = defy.slice(0, 4);
    let index = 1;
    for (let y = 1; y <= h/r; y++)
    {
        for (let x = 1; x <= w/r; x++)
        {
            while(field[index].length)
            {
                field[index].pop();
            }
            for (let i = 0; i < dx.length; i++)//Список смежности, с какими вершинами соеденен
            {
                if(inField(x + dx[i], y + dy[i]))
                {
                    field[index].push(index + dx[i] + dy[i] * w / r);//Если точка не выходит за границы просто сохраняем эту точку как сосед в списке
                }
            }
            index++;
        }    
    }
    if(!onPage)
    {
        settingsPage.style.top = '5%';
    }
    else
    {
        settingsPage.style.top = '-550%';
    }
    onPage = !onPage;
}

doc.getElementById('normal').onclick = function()
{
    localStorage.setItem('level', 'normal');
    dx = defx.slice(0, 6);
    dy = defy.slice(0, 6);
    let index = 1;
    for (let i = 0; i < field.length; i++)
    {
        while(field[i].length)
        {
            field[i].pop();
        }
    }
    for (let y = 1; y <= h/r; y++)
    {
        for (let x = 1; x <= w/r; x++)
        {
            while(field[index].length)
            {
                field[index].pop();
            }
            for (let i = 0; i < dx.length; i++)//Список смежности, с какими вершинами соеденен
            {
                if(inField(x + dx[i], y + dy[i]))
                {
                    field[index].push(index + dx[i] + dy[i] * w / r);//Если точка не выходит за границы просто сохраняем эту точку как сосед в списке
                }
            }
            index++;
        }    
    }
    if(!onPage)
    {
        settingsPage.style.top = '5%';
    }
    else
    {
        settingsPage.style.top = '-550%';
    }
    onPage = !onPage;
}

doc.getElementById('hard').onclick = function()
{
    localStorage.setItem('level', 'hard');
    let index = 1;
    dx = defx.slice(0);
    dy = defy.slice(0);
    for (let y = 1; y <= h/r; y++)
    {
        for (let x = 1; x <= w/r; x++)
        {
            while(field[index].length)
            {
                field[index].pop();
            }
            for (let i = 0; i < dx.length; i++)//Список смежности, с какими вершинами соеденен
            {
                if(inField(x + dx[i], y + dy[i]))
                {
                    field[index].push(index + dx[i] + dy[i] * w / r);//Если точка не выходит за границы просто сохраняем эту точку как сосед в списке
                }
            }
            index++;
        }    
    }
    if(!onPage)
    {
        settingsPage.style.top = '5%';
    }
    else
    {
        settingsPage.style.top = '-550%';
    }
    onPage = !onPage;
}

settingsIcon.onclick = function(event)
{
    if(!onPage)
    {
        settingsPage.style.top = '5%';
    }
    else
    {
        settingsPage.style.top = '-550%';
    }
    onPage = !onPage;
}

musicIcon.onclick = function(event)
{
    if(music.paused)
    {
        music.play();
    }
    else
    {
        music.pause();
    }
}

infoIcon.onclick = function(event)
{
    if(!onPageInfo)
    {
        infoBlock.style.top = '5%';
    }
    else
    {
        infoBlock.style.top = '-550%';
    }
    onPageInfo = !onPageInfo;
}

winIcon.onclick = function()
{
    if(winOnPage)
    {
        winIcon.style.top = '-500%';
    }
    winOnPage = !winOnPage;
}

loseIcon.onclick = function()
{
    if(loseOnPage)
    {
        loseIcon.style.top = '-500%';
    }
    loseOnPage = !loseOnPage;
}

range.onchange = function()
{
    music.volume = range.value / 100;
}

timer = setInterval(()=>
{
    if(music.ended)
    {
        music.play();
    }
}, 1000);