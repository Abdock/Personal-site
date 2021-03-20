var doc = document, math = Math;
var canvas = doc.createElement('canvas');
doc.body.insertBefore(canvas, doc.getElementById('cnv'));
canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style.width = innerWidth + 'px';
canvas.style.height = innerHeight + 'px';
canvas.style.border = '1px solid silver';
canvas.style.boxSizing = 'border-box';
canvas.style.backgroundColor = 'white';
var context = canvas.getContext('2d');
context.fillStyle = doc.getElementById('color').value;
context.strokeStyle = doc.getElementById('color').value;
context.lineWidth = 2;
var lineFromX = 0, lineFromY = 0;
var img = context.getImageData(0, 0, canvas.width, canvas.height);
var OriginalImage = new Image(), image = new Image();
var beforeImage = new ImageData(canvas.width, canvas.height);
var redFilter = false, greenFilter = false, blueFilter = false, grayFilter = false;
var menu = doc.getElementById('control-menu');
var block = doc.getElementById('control-block');
var beforeFilterRegionImage = new ImageData(canvas.width, canvas.height);
var menuMove = false;
var cnt = (sessionStorage.getItem('counter') == null) ? 1 : parseInt(sessionStorage.getItem('counter'));
var miniImage = [];
if (localStorage.getItem(JSON.parse(sessionStorage.getItem('this-user')).Name + ' mini image') !== null)
{
    miniImage = JSON.parse(localStorage.getItem(JSON.parse(sessionStorage.getItem('this-user')).Name + ' mini image'));
}

function resizeCanvas()
{
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    canvas.style.border = '1px solid silver';
    canvas.style.boxSizing = 'border-box';
    canvas.style.backgroundColor = 'white';
    var context = canvas.getContext('2d');
    context.fillStyle = doc.getElementById('color').value;
    context.strokeStyle = doc.getElementById('color').value;
    context.lineWidth = 2;
    context.putImageData(beforeFilterRegionImage, 0, 0, 0, 0, canvas.width, canvas.height);
}

window.addEventListener('resize', resizeCanvas);

function filterRegion(fromX, fromY, toX, toY, color)
{
    context.putImageData(beforeFilterRegionImage, 0, 0, 0, 0, canvas.width, canvas.height);
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = fromY * canvas.width; i < canvas.width * toY; i+=canvas.width * 4)
    {
        for (let j = fromX; j < toX; j++)
        {
            if(color == -3)
            {
                let avg = (imageData.data[j + i] + imageData.data[j + i + 1] + imageData.data[j + i + 2]) / 3
                imageData.data[j + i] = avg;
                imageData.data[j + i + 1] = avg;
                imageData.data[j + i + 2] = avg;
                j+=3;
            }
            else
            {
                if((i + j) % 4 == color)
                {
                    imageData.data[j + i] = 0;
                }
            }
        }
    }
    context.putImageData(imageData, 0, 0, 0, 0, canvas.width, canvas.height);
}

function filterRegionCaller(event1, event2)//event1 is mousedown event, event2 is mousemove event
{
    let cl = -1;
    if(doc.getElementById('region-red-filter').checked)
    {
        cl = 0;
    }
    else if(doc.getElementById('region-green-filter').checked)
    {
        cl = 1;
    }
    else if(doc.getElementById('region-blue-filter').checked)
    {
        cl = 2;
    }
    else if(doc.getElementById('region-gray-filter').checked)
    {
        cl = -3;
    }
    filterRegion(math.min(math.round(event1.offsetX) * 4, math.round(event2.offsetX) * 4), 
    math.min(math.round(event1.offsetY) * 4, math.round(event2.offsetY) * 4),
    math.max(math.round(event1.offsetX) * 4, math.round(event2.offsetX) * 4),
    math.max(math.round(event1.offsetY) * 4, math.round(event2.offsetY) * 4), cl);
}

function drawLine(event1, event2)
{
    context.beginPath();
    context.moveTo(lineFromX, lineFromY);//начинаем с той позицией, где мы были в прошлой раз
    context.lineTo(event2.offsetX, event2.offsetY);//рисуем линию до этой позиции мыши
    lineFromX = event2.offsetX;
    lineFromY = event2.offsetY;
    //сохраняем нынешнюю позицию мыши, чтобы следующую линию нарисовать с этой позиции, изначально они были равны позиции где пользователь нажал на кнопку мыши
    context.fill();
    context.stroke();
}

function drawCircle(event1, event2)
{
    let fromX = event1.offsetX;
    let fromY = event1.offsetY;
    //позиция где была нажата кнопка мыши
    let toX = event2.offsetX;
    let toY = event2.offsetY;
    //Нынешная позиция мыши
    context.clearRect(0, 0, canvas.width, canvas.height);//очищаем канвас
    context.putImageData(img, 0, 0);//вставляем тот канвас который был нарисован до него, потому что мы его очистили
    context.beginPath();
    context.ellipse((fromX + toX) / 2, (fromY + toY) / 2, math.abs(toX - fromX), math.abs(toY - fromY), 0, 0, 2*math.PI, false);//рисуем форму круга
    context.stroke();//рисуем круг
}

function drawRect(event1, event2)
{
    let fromX = event1.offsetX;
    let fromY = event1.offsetY;
    //позиция где была нажата кнопка мыши
    let toX = event2.offsetX;
    let toY = event2.offsetY;
    //Нынешная позиция мыши
    context.clearRect(0, 0, canvas.width, canvas.height);//очищаем канвас
    context.putImageData(img, 0, 0);//вставляем тот канвас который был нарисован до него, потому что мы его очистили
    context.beginPath();
    context.rect(math.min(fromX, toX), math.min(fromY, toY), math.abs(fromX - toX), math.abs(fromY - toY));
    context.stroke();//рисуем прямоугольник
}

function drawForwarLine(event1, event2)
{
    let fromX = event1.offsetX;
    let fromY = event1.offsetY;
    //позиция где была нажата кнопка мыши
    let toX = event2.offsetX;
    let toY = event2.offsetY;
    //Нынешная позиция мыши
    context.clearRect(0, 0, canvas.width, canvas.height);//очищаем канвас
    context.putImageData(img, 0, 0);//вставляем тот канвас который был нарисован до него, потому что мы его очистили
    context.beginPath();
    context.moveTo(fromX, fromY);//сдвигаем точку начало линий на позицию откуда мы начали
    context.lineTo(toX, toY);//рисуем линию до нынешней позиции
    context.stroke();
}

function eraser(event1, event2)
{
    context.clearRect(event2.offsetX - 5, event2.offsetY - 5, 10, 10);
}

function MouseFunction(event1, event2){}//Создаем изначально пустую функцию

canvas.ontouchstart = function(event1)
{
    ev1 = {offsetX: event1.changedTouches[0].pageX - event1.changedTouches[0].radiusX, offsetY: event1.changedTouches[0].pageY - event1.changedTouches[0].radiusY};
    img = context.getImageData(0, 0, canvas.width, canvas.height);//сохраняем прежний нарисованный канвас, потому что мы с большей вероятностью будем его очищать
    lineFromX = ev1.offsetX;
    lineFromY = ev1.offsetY;
    //сохраняем на всякий случай
    canvas.ontouchmove = function(event2)
    {
        ev2 = {offsetX: event2.changedTouches[0].pageX - event2.changedTouches[0].radiusX, offsetY: event2.changedTouches[0].pageY - event2.changedTouches[0].radiusY};
        MouseFunction(ev1, ev2);//Вызов функции MouseFunction
    }
    canvas.ontouchend = function(event)
    {
        if(MouseFunction == filterRegionCaller)
        {
            beforeFilterRegionImage = context.getImageData(0, 0, canvas.width, canvas.height);
        }
        canvas.ontouchmove = null;
    }
}

canvas.onmousedown = function(event1)
{
    img = context.getImageData(0, 0, canvas.width, canvas.height);//сохраняем прежний нарисованный канвас, потому что мы с большей вероятностью будем его очищать
    lineFromX = event1.offsetX;
    lineFromY = event1.offsetY;
    //сохраняем на всякий случай
    canvas.onmousemove = function(event2)
    {
        MouseFunction(event1, event2);//Вызов функции MouseFunction
    }
    canvas.onmouseup = function(event)
    {
        if(MouseFunction == filterRegionCaller)
        {
            beforeFilterRegionImage = context.getImageData(0, 0, canvas.width, canvas.height);
        }
        canvas.onmousemove = null;
    }
}

doc.getElementById('color').onchange = function(event)
{
    context.fillStyle = doc.getElementById('color').value;
    context.strokeStyle = doc.getElementById('color').value;
    //меняем линию обводки и заполнения
}

doc.getElementById('line').onclick = function(event)
{
    MouseFunction = drawLine;//при клике на карандаш, функция MouseFunction будет выполнять код из drawLine
    canvas.style.cursor = 'crosshair';
}

doc.getElementById('circle').onclick = function(event)
{
    MouseFunction = drawCircle;//при клике на круг, функция MouseFunction будет выполнять код из drawCircle
    canvas.style.cursor = 'crosshair';
}

doc.getElementById('rectangle').onclick = function(event)
{
    MouseFunction = drawRect;//при клике на прямоугольник, функция MouseFunction будет выполнять код из drawRect
    canvas.style.cursor = 'crosshair';
}

doc.getElementById('forward').onclick = function(event)
{
    MouseFunction = drawForwarLine;//при клике на на линию, функция MouseFunction будет выполнять код из drawForwardLine
    canvas.style.cursor = 'crosshair';
}

doc.getElementById('eraser').onclick = function(event)
{
    MouseFunction = eraser;
    canvas.style.cursor = 'default';
}

doc.getElementById('filter-region').onclick = function(event)
{
    MouseFunction = filterRegionCaller;
}

doc.getElementById('download-link').onclick = function(event)//кнопка для скачивания
{
    let nCanvas = doc.createElement('canvas');
    nCanvas.width = math.min(image.width, canvas.width);
    nCanvas.height = math.min(image.height, canvas.height);
    nCanvas.getContext('2d').putImageData(context.getImageData(0, 0, image.width, image.height), 0, 0);
    let link = doc.getElementById('download-link');
    link.href = canvas.toDataURL('image/png');
    link.setAttribute('download', 'image.png');
}

doc.getElementById('save-link').onclick = function(event)
{
    let nCanvas = doc.createElement('canvas');
    //Создаем новый канвас, чтобы в нем сохранить объект изображение, потому что иначе если фото полностью не покрывала наш основной канвас будут проблемы
    nCanvas.width = math.min(image.width, canvas.width);
    nCanvas.height = math.min(image.height, canvas.height);
    //задаем размер как у изображения
    nCanvas.getContext('2d').putImageData(context.getImageData(0, 0, image.width, image.height), 0, 0);
    //Рисуем внутри нового канваса то что сейчас находится на основном, предварительно обрезая его
    try {
        sessionStorage.setItem('image' + cnt++, nCanvas.toDataURL('image/jpeg'));
        //Пытаемся сохранить фото в формате jpg, так как с форматом png у нас это не получится
        sessionStorage.setItem('counter', cnt);
        //Сохраняем номер так как пользователь может перезайти на страницу, и в этом случае значение номера сбросится и при попытке сохранить наши данные пере запишутся
    } catch (exception) {
        alert("Sorry, we can't save this photo in the galery, because it\'s too big");
        sessionStorage.removeItem('image' + --cnt);
        //Если не получилось удаляем то что мы сохранили, хоть там может и ничего не быть
        sessionStorage.setItem('counter', cnt);
        //Перезаписываем значение счетчика
    }
    if(miniImage.length < 4)
    {
        miniImage.push(nCanvas.toDataURL('image/jpeg'));
        try {
            localStorage.setItem(JSON.parse(sessionStorage.getItem('this-user')).Name + ' mini image', JSON.stringify(miniImage));
        } catch (error) {}
    }
}

doc.getElementById('file').onchange = function(event) //для подзагрузки фото
{
    let file = doc.getElementById('file').files[0];//берем первый элемент из этого списка
    if(file.type.indexOf('image') >= 0)//проверяем, фото ли это
    {
        let reader = new FileReader();
        reader.readAsDataURL(file);//считываем этот файл
        reader.onload = function(event)//проверяем закончил ли он считывать картину
        {
            let nImage = new Image();//создаем новую картинку
            nImage.onload = function(event)//проверяем подгрузилась ли картинка
            {
                context.clearRect(0, 0, canvas.width, canvas.height);//очищаем канвас, на всякий случай
                context.drawImage(nImage, 0, 0, nImage.width, nImage.height, 0, 0, math.min(canvas.width, nImage.width), math.min(canvas.height, nImage.height));
                //Рисуем рисунок который получили на канвасе
                beforeFilterRegionImage = beforeImage = context.getImageData(0, 0, canvas.width, canvas.height)//Сохраняем ImageData чтобы востановить фильтр
            }
            nImage.src = reader.result;//сохраняем это фото
            OriginalImage = image = nImage;//сохраняем его в глобальной переменной
        }
    }
    else
    {
        alert('You must to enter images');
        return false;
    }
}

function Filter(color, value)//функция фильтра, который фильтрует цвета RGB
{
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = color; i < imageData.data.length; i+=4)
    {
        imageData.data[i] = value;
    }
    context.putImageData(imageData, 0, 0, 0, 0, canvas.width, canvas.height);
}

function AntiFilter(color)
{
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = color; i < imageData.data.length; i+=4)
    {
        imageData.data[i] = beforeImage.data[i];
    }
    context.putImageData(imageData, 0, 0, 0, 0, canvas.width, canvas.height);
}

doc.getElementById('red-filter').onchange = function(event)
{
    if(!redFilter)
    {
        Filter(0, 0);
    }
    else
    {
        AntiFilter(0);
    }
    redFilter = !redFilter;
}

doc.getElementById('green-filter').onchange = function(event)
{
    if(!greenFilter)
    {
        Filter(1, 0);
    }
    else
    {
        AntiFilter(1);
    }
    greenFilter = !greenFilter;
}

doc.getElementById('blue-filter').onchange = function(event)
{
    if(!blueFilter)
    {
        Filter(2, 0);
    }
    else
    {
        AntiFilter(2);
    }
    blueFilter = !blueFilter;
}

doc.getElementById('gray-filter').onchange = function(event)
{
    if(!grayFilter)
    {
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let average = 0;
        for (let i = 0; i < imageData.data.length; i+=4)
        {
            average = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            imageData.data[i] = average;
            imageData.data[i + 1] = average;
            imageData.data[i + 2] = average;
        }
        context.putImageData(imageData, 0, 0);
    }
    else
    {
        AntiFilter(0);
        AntiFilter(1);
        AntiFilter(2);
    }
    grayFilter = !grayFilter;
}

window.onscroll = function(event)
{
    if(this.scrollY > 50)
    {
        this.menu.style.top =  '0';
    }
    else
    {
        this.menu.style.top =  '50px';
    }
}

menu.onclick = function(event)
{
    // console.log(event);
    if(event.ctrlKey && event.which == 1)
    {
        if(!menuMove)
        {
            menu.style.transition = '0s';
            menu.removeChild(block);
        }
        else
        {
            menu.style.transition = '0.3s';
            menu.appendChild(block);
        }
        menuMove = !menuMove;
    }
}

doc.body.onmousemove = function(event)
{
    if(menuMove)
    {
        menu.style.left = event.clientX - 60 + 'px';
        menu.style.top = event.clientY - 25 + 'px';
    }
}