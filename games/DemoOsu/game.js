var doc = document, math = Math;
var audio = doc.createElement('audio');
audio.id = 'audio';
var block = doc.getElementById('block');
var analyser, context, src, array, listener, destination, panner;
var file = doc.getElementById('file');
block.style.height = innerHeight + 'px';
var was = 0;
var score = doc.getElementById('score');
var scoreCount = 0;
var timerStart = false, eventTimer = null;
var add = 20;
var canvas = doc.createElement('canvas');
var visual = canvas.getContext('2d');
var lineCount = 2 * 512;
var distance = 0;
var choosed = false;
block.appendChild(canvas);

function setStyle(array = [], styleObj = {})
{
    for (let i = 0; i < array.length; i++)
    {
        for (const key in styleObj)
        {
            array[i].style[key] = styleObj[key];
        }
    }
}

function resizeCanvas()
{
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    visual.fillStyle = 'red';
}

function drawCanvas()
{
    for (let i = 0; i < lineCount; i++)
    {
        visual.fillRect(innerWidth / lineCount * i, innerHeight / 2 - 50, innerWidth / lineCount, 100);
    }
}

(()=>
{
    if(navigator.userAgent.indexOf('Mobile') > -1)
    {
        doc.getElementById('upload-button').style.display = 'none';
        let selectMenu = doc.createElement('div');
        setStyle([selectMenu], {width: '80%',
        height: '60%',
        margin: '10% 10%',
        border: '1px solid silver',
        borderRadius: '50px',
        background: 'darkred',
        textAlign: 'center',
        boxSizing: 'border-box',
        padding: '1.5%',
        overflow: 'hidden'});
        doc.body.insertBefore(selectMenu, block);
        let list = doc.createElement('ul');
        let header = doc.createElement('h1');
        header.textContent = 'Select Music';
        selectMenu.appendChild(header);
        selectMenu.appendChild(list);
        let name = ['M1', 'M2', 'M3', 'M4', 'M5'];
        let src = ['ThisGamePianoCover.mp3', 'NeverMeantToBelongPianoCover.mp3', 'End.mp3', 'M1.mp3', 'M2.mp3'];
        setStyle([list], {
            textAlign: 'left',
            fontSize: '1.7em',
            marginLeft: '2%',
            listStyle: 'none'
        });
        for (let i = 0; i < 5; i++)
        {
            let li = doc.createElement('li');
            list.appendChild(li);
            li.textContent = name[i];
            li.onclick = (event)=>
            {
                audio.src = '../Music/' + src[i];
                selectMenu.style.display = 'none';
                choosed = true;
                resizeCanvas();
                drawCanvas();
                preparation();
                audio.play();
            };
        }
    }
})()

window.addEventListener('resize', ()=>
{
    if(choosed)
    {
        resizeCanvas();
        drawCanvas();
    }
})

file.addEventListener('change', async (event)=>
{
    let get = file.files[0];
    if(get.type.indexOf('audio') > -1)
    {
        let reader = new FileReader();
        reader.readAsDataURL(get);
        reader.onload = await function(event)
        {
            let music = new Audio();
            music.onload = function(event){};
            audio.src = reader.result;
            file.style.display = 'none';
            doc.getElementById('upload-button').style.display = 'none';
            choosed = true;
            resizeCanvas();
            drawCanvas();
            audio.play();
            audio.volume = 0.7;
            preparation();
        }
    }
});

function Press(event)
{
    if(add > 0)
    {
        visual.fillStyle = 'red';
        visual.strokeStyle = 'red';
    }
    scoreCount = math.max(0, scoreCount + add);
    score.textContent = "Score: " + scoreCount;
}

function MousePress(event)
{
    if(event.which == 1)
    {
        scoreCount = math.max(0, scoreCount + add);
        localStorage.setItem(sessionStorage.getItem('user-name') + ' catch rithm', scoreCount);
        score.textContent = "Score: " + scoreCount;
    }
}

function preparation()
{
    context = new AudioContext();
    analyser = context.createAnalyser();
    src = context.createMediaElementSource(audio);
    listener = context.listener;
    destination = context.destination;
    panner = context.createPanner();
    src.connect(analyser);
    src.connect(panner);
    analyser.connect(context.destination);
    panner.connect(context.destination);
    loop();
}

function rgb(r, g, b)
{
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

function loop()
{
    let cnt = 0;
    requestAnimationFrame(loop);
    array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    visual.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < array.length; i++)
    {
        visual.fillRect(innerWidth / 2 + innerWidth / lineCount * (i + 1), innerHeight / 2 - 50 - array[i] / 2, innerWidth / lineCount, 100 + array[i]);
        visual.fillRect(innerWidth / 2 - innerWidth / lineCount * i, innerHeight / 2 - 50 - array[i] / 2, innerWidth / lineCount, 100 + array[i]);
        if(array[i] > 0)
        {
            cnt = math.max(array[i], cnt);
        }
    }
    if(cnt > was)
    {
        window.onkeyup = Press;
        window.onclick = MousePress;
        if(!timerStart)
        {
            add = 20;
            timerStart = true;
            eventTimer = setTimeout(()=>
            {
                add = -60;
                timerStart = false;
            }, 150);
        }
        else
        {
            timerStart = true;
            add = 20;
            clearTimeout(eventTimer);
            eventTimer = setTimeout(()=>
            {
                timerStart = false;
                add = -60;
            }, 200);
        }
    }
    was = cnt;
    visual.strokeStyle = 'darkred';
    visual.fillStyle = 'darkred';
}

window.addEventListener('keydown', (event)=>
{
    if(event.key == '+')
    {
        audio.volume = math.min(1, audio.volume + 0.05);
    }
    else if(event.key == '-')
    {
        audio.volume = math.max(0, audio.volume - 0.05);
    }
})