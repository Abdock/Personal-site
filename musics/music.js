var doc = document, math = Math;
var audio = doc.createElement('audio');
var video = doc.createElement('video');
var isVideo = false;
var context, analyser, array;
var setted = false;
var file = doc.getElementById('file');
var canvas = doc.createElement('canvas');
var visual = canvas.getContext('2d');
var visualiastionLook = true;
var visualisationLength;
var visualisationArraySize = math.min(innerWidth/2, 1024);
var MusicPageVisualisationColor = sessionStorage.getItem('Music page visualisation color') || 'rgba(0, 128, 255, 0.8)';
var panelsShow = true;
var started = false;
doc.getElementById('visualisation-block').appendChild(canvas);
audio.setAttribute('controls', 'true');
audio.id = 'music';

function resizeCanvas()
{
    canvas.width = doc.body.clientWidth;
    canvas.height = doc.getElementById('visualisation-block').clientHeight;
    canvas.style.width = doc.body.clientWidth + 'px';
    canvas.style.height = doc.getElementById('visualisation-block').clientHeight + 'px';
    visual.fillStyle = MusicPageVisualisationColor;
    visualisationArraySize = math.min(innerWidth/2, 1024);
}

function drawCanvas()
{
    let size = visualisationArraySize;
    for (let i = 0; i < size; i++)
    {
        visual.fillRect(innerWidth / size * i, canvas.height - 50, innerWidth / size, 50);
    }
}

(()=>
{
    resizeCanvas();
    drawCanvas();
})()

doc.getElementById('speed').onchange = function(event)
{
    audio.playbackRate = parseFloat(math.pow(2, this.value));
}

doc.getElementById('show-visualisation').onclick = function()
{
    if(visualiastionLook)
    {
        doc.getElementById('visualisation-block').style.display = 'none';
        this.textContent = 'Show Visualisation';
    }
    else
    {
        doc.getElementById('visualisation-block').style.display = 'block';
        this.textContent = 'Hide Visualisation';
    }
    visualiastionLook = !visualiastionLook;
}

function ShowHidePanel(event)
{
    if(event.code == 'Space')
    {
        if(panelsShow)
        {
            doc.getElementById('audio-block').style.display = 'none';
            doc.getElementById('control-block').style.display = 'none';
            video.play();
            audio.play();
        }
        else
        {
            doc.getElementById('audio-block').style.display = 'block';
            doc.getElementById('control-block').style.display = 'block';
            doc.getElementById('control-block').style.background = MusicPageVisualisationColor;
            doc.getElementById('speed').onchange = function(event)
            {
                video.playbackRate = parseFloat(math.pow(2, this.value));
            }
            video.pause();
            audio.pause();
        }
        panelsShow = !panelsShow;
    }
}

file.onchange = function(event)
{
    let getFile = file.files[0];
    let readEnd = true;
    if(getFile.type.indexOf('audio') > -1)
    {
        let reader = new FileReader();
        reader.readAsDataURL(getFile);
        reader.onload = async function(event)
        {
            audio.src = reader.result;
            await audio.play();
            if(!started)
            {
                preporation(audio);
                started = true;
            }
            doc.getElementById('audio-block').appendChild(audio);
            if(navigator.userAgent.indexOf('Mobile') == -1)
            {
                doc.getElementById('audio-block').style.display = 'none';
                doc.getElementById('control-block').style.display = 'none';
                panelsShow = false;
                window.addEventListener('keydown', ShowHidePanel);
            }
        }
        reader.onerror = function(event)
        {
            alert("error");
        }
    }
    else if(getFile.type.indexOf('video') > -1)
    {
        let reader = new FileReader();
        reader.readAsDataURL(getFile);
        reader.onload = async function(event)
        {
            video.src = reader.result;
            video.style.width = '100%';
            video.style.height = 'auto';
            if(navigator.userAgent.indexOf('Mobile') > -1)
            {
                video.style.position = 'relative';
            }
            else
            {
                video.style.position = 'fixed';
            }
            video.controls = 'true';
            video.style.top = '0';
            video.style.left = '0';
            video.style.zIndex = '-2';
            isVideo = true;
            await video.play();
            preporation(video);
            if(!setted)
            {
                if(navigator.userAgent.indexOf('Mobile') > -1)
                {
                    doc.getElementById('audio-block').appendChild(video);
                }
                else
                {
                    doc.body.appendChild(video);
                    doc.getElementById('audio-block').style.display = 'none';
                    doc.getElementById('control-block').style.display = 'none';
                    panelsShow = false;
                    window.addEventListener('keydown', ShowHidePanel);
                }
                setted = true;
                doc.getElementById('upload-button').style.display = 'none';
            }
        }
        reader.onerror = function(event)
        {
            alert("error");
        }
    }
    else
    {
        alert("This isn\'t audio or video");
    }
}

window.addEventListener('resize', function(event)
{
    resizeCanvas();
    drawCanvas();
});

async function preporation(file)
{
    context = new AudioContext();
    analyser = context.createAnalyser();
    src = context.createMediaElementSource(file);
    src.connect(analyser);
    analyser.connect(context.destination);
    loop();
}

async function loop()
{
    requestAnimationFrame(loop);
    if(!isVideo)
    {
        if(!audio.ended && !audio.paused)
        {
            array = new Uint8Array(visualisationArraySize);
            analyser.getByteFrequencyData(array);
            visual.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < array.length; i++)
            {
                visual.fillRect(innerWidth / array.length * i, canvas.height - 50 - array[i], innerWidth / array.length, 50 + array[i]);
            }
            visual.lineCap = 'round';
        }
    }
    else
    {
        if(!video.ended && !video.paused)
        {
            array = new Uint8Array(visualisationArraySize);
            analyser.getByteFrequencyData(array);
            visual.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < array.length; i++)
            {
                visual.fillRect(innerWidth / array.length * i, canvas.height - 50 - array[i], innerWidth / array.length, 50 + array[i]);
            }
            visual.lineCap = 'round';
        }
    }
}