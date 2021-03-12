var doc = document, math = Math;
var cnv = doc.createElement('canvas');
cnv = doc.getElementById('cnv');
var ctx = cnv.getContext('2d');
doc.body.style.minHeight = window.innerHeight + 'px';
cnv.width = doc.body.scrollWidth;
cnv.height = doc.body.scrollHeight;
ctx.fillStyle = '#1e1e1e';
ctx.strokeStyle = '#1e1e1e';
var was = false;
var night = false;
var r = 1;
var screenDiagonal = math.floor(math.sqrt(math.pow(cnv.width, 2) + math.pow(cnv.height, 2)));
var theme = doc.createElement('li');
var googleMap = doc.getElementById('google-map');
var cancel = false;
var stored = [];
var mover = false;
var transition, moveTarget, moveX, moveY;
var loadEndFrom;
var backgroundCanvas = doc.createElement('canvas');
var backgroundContext = backgroundCanvas.getContext('2d');
var clickCount = 3;
var clickReturnStart = false;
const gcd = (a = 1, b = 0)=>{ return (b == 0) ? a : gcd(math.max(a % b, b), math.min(a % b, b)); };
theme = doc.getElementsByClassName('menu-item')[4];

if(sessionStorage.getItem(doc.head.getElementsByTagName('title')[0].textContent + '-stored') !== null)
{
    function GetNumber(str)
    {
        for (let i = 0; i < str.length; i++)
        {
            if (!isNaN(parseInt(str[i])))
            {
                return i;
            }
        }
        return -1;
    }
    let nm = doc.head.getElementsByTagName('title')[0].textContent + '-';
    stored = JSON.parse(sessionStorage.getItem(nm + 'stored'));
    for (let i = 0; i < stored.length; i++)
    {
        let x = stored[i].slice(nm.length, stored[i].length);
        let n = x.slice(GetNumber(x), x.length);
        x = x.slice(0, GetNumber(x));
        try
        {
            setStyle(doc.getElementsByTagName(x)[n], JSON.parse(sessionStorage.getItem(stored[i])));
        }
        catch (error){}
    }
}

window.onresize = function(event)
{
    this.doc.body.style.minHeight = innerHeight + 'px';
    cnv.width = doc.body.scrollWidth;
    cnv.height = doc.body.scrollHeight;
    ctx.fillStyle = '#1e1e1e';
    ctx.strokeStyle = '#1e1e1e';
    screenDiagonal = math.floor(math.sqrt(math.pow(cnv.width, 2) + math.pow(cnv.height, 2)));
    if(this.night)
    {
        this.ctx.fillRect(0, 0, cnv.width, cnv.height);
    }
    else
    {
        this.ctx.clearRect(0, 0, cnv.width, cnv.height);
    }
}

theme.onclick = async function ChangeTheme(event)
{
    if(event.which == 1)
    {
        if(was)
        {
            return false;
        }
        was = true;
        if (!night)
        {
            doc.body.style.minHeight = innerHeight + 'px';
            cnv.width = doc.body.scrollWidth;
            cnv.height = doc.body.scrollHeight;
            ctx.fillStyle = '#1e1e1e';
            ctx.strokeStyle = '#1e1e1e';
            screenDiagonal = math.floor(math.sqrt(math.pow(cnv.width, 2) + math.pow(cnv.height, 2)));
            let timer = setInterval(async ()=>
            {
                doc.body.style.color = 'rgb(' + (255 / 74) * r + ', ' + (255 / 74) * r + ', ' + (255 / 74) * r + ')';
                for (const iterator of doc.getElementsByTagName('button'))
                {
                    iterator.style.color = 'rgb(' + (255 / 74) * r + ', ' + (255 / 74) * r + ', ' + (255 / 74) * r + ')';
                }
                for (const iterator of doc.getElementsByTagName('a'))
                {
                    iterator.style.color = 'rgb(' + (255 / 74) * r + ', ' + (255 / 74) * r + ', ' + (255 / 74) * r + ')';
                }
                ctx.clearRect(0, 0, cnv.width, cnv.height);
                ctx.beginPath();
                ctx.arc(event.x, event.y, 15 * r, 0, 2 * math.PI, false);
                ctx.fill();
                ctx.stroke();
                r++;
                if(r * 12 > screenDiagonal)
                {
                    ctx.closePath();
                    clearInterval(timer);
                    was = false;
                }
            }, 15);
        }
        else
        {
            let timer = setInterval(async ()=>
            {
                doc.body.style.color = 'rgb(' + (255 / 74) * r + ', ' + (255 / 74) * r + ', ' + (255 / 74) * r + ')';
                for (const iterator of doc.getElementsByTagName('button'))
                {
                    iterator.style.color = 'rgb(' + (255 / 74) * r + ', ' + (255 / 74) * r + ', ' + (255 / 74) * r + ')';
                }
                for (const iterator of doc.getElementsByTagName('a'))
                {
                    iterator.style.color = 'rgb(' + (255 / 74) * r + ', ' + (255 / 74) * r + ', ' + (255 / 74) * r + ')';
                }
                ctx.clearRect(0, 0, cnv.width, cnv.height);
                ctx.beginPath();
                ctx.arc(event.x, event.y, 15 * r, 0, 2 * math.PI, false);
                ctx.fill();
                ctx.stroke();
                r--;
                if(r <= 0)
                {
                    ctx.clearRect(0, 0, cnv.width, cnv.height);
                    ctx.closePath();
                    clearInterval(timer);
                    was = false;
                }
            }, 15);
        }
        night = !night;
    }
}

function setStyle(obj, styleObj = {})
{
    for (const key in styleObj)
    {
        obj.style[key] = styleObj[key];
    }
}

function getIndex(element)
{
    let array = doc.getElementsByTagName(element.tagName);
    for (let i = 0; i < array.length; i++)
    {
        if(array[i] == element)
        {
            return i;
        }
    }
    return -1;
}

window.onclick = function(event)
{
    if(navigator.userAgent.indexOf('Mobile') > -1)
    {
        this.clickCount--;
        if(!clickReturnStart)
        {
            this.clickReturnStart = true;
            this.setTimeout(()=>{this.clickCount = 3; this.clickReturnStart = false;}, 500);
        }
        else if(this.clickCount == 0)
        {
            createSettingBlock(event);
        }
    }
    else 
    {
        if(event.which == 1 && event.shiftKey && event.ctrlKey)
        {
            createSettingBlock(event);
        }
    }
};

function createSettingBlock(event)
{
    //Создаем сам блог настроек
    let setting = this.doc.createElement('div');
    this.setStyle(setting, {
        position: "absolute",
        border: '1px solid silver',
        minWidth: '100px',
        left: event.pageX + 'px',
        top: event.pageY + 'px',
        zIndex: '99999',
        backgroundColor: 'white',
        color: 'black',
        padding: '1%',
        width: 'auto',
        display: 'inline-block',
        fontFamily: 'Play'
    });
    let headers = [];
    let bodies = [];
    let styles = {};
    let target = event.target;
    function disableActive()
    {
        for (let i = 0; i < bodies.length; i++)
        {
            bodies[i].classList.remove('active-tab');
        }
    }
    //Создаем вкладки
    //Color tab
    //===================================================Begin insert===================================================
    let backgroundHeader = doc.createElement('div');
    let backgroundBody = doc.createElement('div');
    let backgroundList = doc.createElement('ul');
    backgroundHeader.onclick = (e)=>
    {
        disableActive();
        backgroundBody.classList.add('active-tab');
    }
    backgroundHeader.classList.add('tab-header');
    backgroundBody.classList.add('tab-body', 'active-tab');
    backgroundHeader.textContent = 'Background';
    backgroundBody.appendChild(backgroundList);
    let bgColorItem = doc.createElement('li');
    let bgColor = doc.createElement('input');
    bgColor.type = 'color';
    bgColor.value = target.style.backgroundColor;
    bgColor.oninput = function(e)
    {
        target.style.backgroundColor = this.value;
        styles.backgroundColor = this.value;
    }
    bgColorItem.textContent = 'Color: ';
    bgColorItem.appendChild(bgColor);
    backgroundList.appendChild(bgColorItem);
    //Gradient tab
    let bgGradientItem = doc.createElement('li');
    let bgGradientFrom = doc.createElement('input');
    let bgGradientTo = doc.createElement('input');
    let bgGradientStyle = doc.createElement('select');
    bgGradientFrom.type = 'color';
    bgGradientTo.type = 'color';
    let bgGradientTop = doc.createElement('option');
    let bgGradientBottom = doc.createElement('option');
    let bgGradientLeft = doc.createElement('option');
    let bgGradientRight = doc.createElement('option');
    let bgGradientTopRight = doc.createElement('option');
    let bgGradientBottomRight = doc.createElement('option');
    let bgGradientBottomLeft = doc.createElement('option');
    let bgGradientTopLeft = doc.createElement('option');
    let bgGradientSpanGr = doc.createElement('span');
    let bgGradientSpanFr = doc.createElement('span');
    let bgGradientSpanTo = doc.createElement('span');
    let bgGradientSpanPercent = doc.createElement('span');
    let bgGradiendPercent = doc.createElement('input');
    bgGradiendPercent.type = 'range';
    bgGradiendPercent.min = '0';
    bgGradiendPercent.max = '100';
    bgGradientFrom.value = target.style.background.slice(26, 40);
    bgGradientTo.value = target.style.background.slice(42, target.style.background.length - 1);
    bgGradientSpanGr.textContent = 'Linear-gradient: ';
    bgGradientSpanFr.textContent = 'from: ';
    bgGradientSpanTo.textContent = 'to: ';
    bgGradientSpanPercent.textContent = 'ratio: ';
    bgGradientTop.textContent = 'to top';
    bgGradientTopRight.textContent = 'to top right';
    bgGradientRight.textContent = 'to right';
    bgGradientBottomRight.textContent = 'to bottom right';
    bgGradientBottom.textContent = 'to bottom';
    bgGradientBottomLeft.textContent = 'to bottom left';
    bgGradientLeft.textContent = 'to left';
    bgGradientTopLeft.textContent = 'to top left';
    bgGradientStyle.appendChild(bgGradientTop);
    bgGradientStyle.appendChild(bgGradientTopRight);
    bgGradientStyle.appendChild(bgGradientRight);
    bgGradientStyle.appendChild(bgGradientBottomRight);
    bgGradientStyle.appendChild(bgGradientBottom);
    bgGradientStyle.appendChild(bgGradientBottomLeft);
    bgGradientStyle.appendChild(bgGradientLeft);
    bgGradientStyle.appendChild(bgGradientTopLeft);
    bgGradientStyle.onchange = function(e)
    {
        target.style.background = 'linear-gradient(' + bgGradientStyle.value + ', ' + bgGradientFrom.value + ', ' + bgGradientTo.value + ')';
        styles.background = 'linear-gradient(' + bgGradientStyle.value + ', ' + bgGradientFrom.value + ', ' + bgGradientTo.value + ')';
    }
    bgGradientTo.oninput = function(e)
    {
        target.style.background = 'linear-gradient(' + bgGradientStyle.value + ', ' + bgGradientFrom.value + ', ' + bgGradientTo.value + ')';
        styles.background = 'linear-gradient(' + bgGradientStyle.value + ', ' + bgGradientFrom.value + ', ' + bgGradientTo.value + ')';
    }
    bgGradientFrom.oninput = function(e)
    {
        target.style.background = 'linear-gradient(' + bgGradientStyle.value + ', ' + bgGradientFrom.value + ', ' + bgGradientTo.value + ')';
        styles.background = 'linear-gradient(' + bgGradientStyle.value + ', ' + bgGradientFrom.value + ', ' + bgGradientTo.value + ')';
    }
    bgGradiendPercent.oninput = function (e)
    {
        target.style.background = 'linear-gradient(' + bgGradientStyle.value + ', ' + bgGradientFrom.value + ' ' + bgGradiendPercent.value + '%, ' + bgGradientTo.value + ' ' + (100 - bgGradiendPercent.value) + '%)';
        styles.background = 'linear-gradient(' + bgGradientStyle.value + ', ' + bgGradientFrom.value + ' ' + bgGradiendPercent.value + '%, ' + bgGradientTo.value + ' ' + (100 - bgGradiendPercent.value) + '%)';
    }
    bgGradientItem.append(bgGradientSpanGr, bgGradientStyle, bgGradientSpanFr, bgGradientFrom, bgGradientSpanTo, bgGradientTo, bgGradientSpanPercent, bgGradiendPercent);
    backgroundList.appendChild(bgGradientItem);
    let bgImageItem = doc.createElement('li');
    let bgImage = doc.createElement('input');
    bgImage.type = 'file';
    bgImage.onchange = async function(e)
    {
        let file = bgImage.files[0];
        if(file.type.indexOf('image') > -1)
        {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = await function(e)
            {
                let nImage = new Image();
                nImage.src = reader.result;
                nImage.onload = async function() {
                    let g = gcd(nImage.width, nImage.height)
                    let ratioX = nImage.width / g;
                    let ratioY = nImage.height / g;
                    let cmp = math.max(math.ceil(target.clientWidth / ratioX), math.ceil(target.clientHeight / ratioY));
                    backgroundCanvas.width = math.min(cmp * ratioX, nImage.width);
                    backgroundCanvas.height = math.min(cmp * ratioY, nImage.height);
                    backgroundContext.drawImage(nImage, 0, 0, nImage.width, nImage.height, 0, 0, math.min(backgroundCanvas.width, nImage.width), math.min(backgroundCanvas.height, nImage.height));
                    let source = await backgroundCanvas.toDataURL('image/jpeg');
                    target.style.backgroundImage = 'url(' + source + ')';
                    target.style.backgroundSize = 'cover';
                    styles.backgroundImage = 'url(' + source + ')';
                    styles.backgroundSize = 'cover';
                    if(doc.title == "Music" && target == doc.body)
                    {
                        backgroundCanvas.width = ratioX;
                        backgroundCanvas.height = ratioY;
                        backgroundContext.drawImage(nImage, 0, 0, nImage.width, nImage.height, 0, 0, math.min(backgroundCanvas.width, nImage.width), math.min(backgroundCanvas.height, nImage.height));
                        let imgData = backgroundContext.getImageData(0, 0, backgroundCanvas.width, backgroundCanvas.height).data;
                        let r = 0, g = 0, b = 0;
                        let rcnt = 0, gcnt = 0, bcnt = 0;
                        for (let i = 0; i < imgData.length; i++)
                        {
                            if(i % 4 == 0)
                            {
                                r+=imgData[i];
                                rcnt++;
                            }
                            else if(i % 4 == 1)
                            {
                                g+=imgData[i];
                                gcnt++;
                            }
                            else if(i % 4 == 2)
                            {
                                b+=imgData[i];
                                bcnt++;
                            }
                        }
                        MusicPageVisualisationColor = 'rgba(' + (10 + math.round(r / rcnt)) + ', ' + (10 + math.round(g / gcnt)) + ', ' + (10 + math.round(b / bcnt)) + ', 0.8)';
                        sessionStorage.setItem('Music page visualisation color', MusicPageVisualisationColor);
                        resizeCanvas();
                        drawCanvas();
                    }
                }
            }
        }
        else
        {
            alert('Is not image');
        }
    }
    bgImageItem.textContent = 'Image: ';
    bgImageItem.appendChild(bgImage);
    backgroundList.appendChild(bgImageItem);
    let bgSizeItem = doc.createElement('li');
    backgroundList.appendChild(bgSizeItem);
    bgSizeItem.textContent = 'Size: ';
    //
    let bgSize = doc.createElement('select');
    bgSizeItem.appendChild(bgSize);
    let bgCoverSize = doc.createElement('option');
    bgCoverSize.textContent = 'cover';
    bgSize.appendChild(bgCoverSize);
    let bgContainSize = doc.createElement('option');
    bgContainSize.textContent = 'contain';
    bgSize.appendChild(bgContainSize);
    let bgAutoSize = doc.createElement('option');
    bgAutoSize.textContent = 'auto';
    bgSize.appendChild(bgAutoSize);
    let bgInheritSize = doc.createElement('option');
    bgInheritSize.textContent = 'inherit';
    bgSize.appendChild(bgInheritSize);
    bgSize.onchange = function(e)
    {
        target.style.backgroundSize = this.value;
        styles.backgroundSize = this.value;
    }
    let bgRepeatItem = doc.createElement('li');
    bgRepeatItem.textContent = 'Repeat: ';
    let bgRepeat = doc.createElement('input');
    bgRepeatItem.appendChild(bgRepeat);
    bgRepeat.type = 'checkbox';
    bgRepeat.checked = 'true';
    bgRepeat.onchange = function(e)
    {
        if(bgRepeat.checked)
        {
            target.style.backgroundRepeat = 'repeat';
        }
        else
        {
            target.style.backgroundRepeat = 'no-repeat';
        }
    }
    backgroundList.appendChild(bgRepeatItem);
    //insert background block
    headers.push(backgroundHeader);
    bodies.push(backgroundBody);
    //text block
    let textHeader = doc.createElement('div');
    let textBody = doc.createElement('div');
    let textList = doc.createElement('ul');
    textHeader.classList.add('tab-header');
    textBody.classList.add('tab-body');
    textHeader.textContent = 'Text';
    textBody.appendChild(textList);
    textHeader.onclick = (e)=>
    {
        disableActive();
        textBody.classList.add('active-tab');
    }
    let textSizeItem = doc.createElement('li');
    let textSize = doc.createElement('input');
    textSize.type = 'number';
    textSize.min = '8';
    textSize.value = '14';
    textSizeItem.textContent = 'Size: ';
    textSize.oninput = function(e)
    {
        target.style.fontSize = this.value + 'px';
        styles.fontSize = this.value + 'px';
    }
    textSizeItem.appendChild(textSize);
    textList.appendChild(textSizeItem);
    let textColorItem = doc.createElement('li');
    let textColor = doc.createElement('input');
    textColor.type = 'color';
    textColor.oninput = function(e)
    {
        event.target.style.color = this.value;
        styles.color = this.value;
    }
    textColorItem.textContent = 'Color';
    textColorItem.appendChild(textColor);
    textList.appendChild(textColorItem);
    let textFamilyItem = doc.createElement('li');
    let textFamily = doc.createElement('select');
    textFamilyItem.textContent = 'Family: ';
    textFamilyItem.appendChild(textFamily);
    let lobsterFont = doc.createElement('option');
    lobsterFont.textContent = 'Lobster';
    let playBoldFont = doc.createElement('option');
    playBoldFont.textContent = 'Play Bold';
    let playFont = doc.createElement('option');
    playFont.textContent = 'Play';
    let robotoFont = doc.createElement('option');
    robotoFont.textContent = 'Roboto';
    let robotoBoldFont = doc.createElement('option');
    robotoBoldFont.textContent = 'Roboto Bold';
    let robotoItalicFont = doc.createElement('option');
    robotoItalicFont.textContent = 'Roboto Italic';
    let pacificioFont = doc.createElement('option');
    pacificioFont.textContent = 'Pacificio';
    let openSansFont = doc.createElement('option');
    openSansFont.textContent = 'Open Sans';
    let notoSerifFont = doc.createElement('option');
    notoSerifFont.textContent = 'Noto Serif';
    let notoSerifBoldFont = doc.createElement('option');
    notoSerifBoldFont.textContent = 'Noto Serif Bold';
    let notoSerifItalicFont = doc.createElement('option');
    notoSerifItalicFont.textContent = 'Noto Serif Italic';
    textFamily.append(lobsterFont,
        playFont,
        playBoldFont,
        notoSerifItalicFont,
        notoSerifFont,
        notoSerifBoldFont,
        openSansFont,
        pacificioFont,
        robotoFont,
        robotoBoldFont,
        robotoItalicFont)
    textFamily.onchange = function(e)
    {
        target.style.fontFamily = this.value;
        styles.fontFamily = this.value;
    }
    textList.appendChild(textFamilyItem);
    let textLineHeightItem = doc.createElement('li');
    let textLineHeight = doc.createElement('input');
    textLineHeight.type = 'range';
    textLineHeight.min = '0';
    textLineHeight.value = '25';
    textLineHeightItem.textContent = 'Line-height: ';
    textLineHeightItem.appendChild(textLineHeight);
    textList.appendChild(textLineHeightItem);
    textLineHeight.oninput = function(e)
    {
        target.style.lineHeight = this.value + 'px';
        styles.lineHeight = this.value + 'px';
    }
    let textSpaceItem = doc.createElement('li');
    let textSpace = doc.createElement('input');
    textSpace.type = 'range';
    textSpace.min = '0';
    textSpace.value = '0';
    textSpaceItem.textContent = 'Word space: ';
    textSpaceItem.appendChild(textSpace);
    textList.appendChild(textSpaceItem);
    textSpace.oninput = function(e)
    {
        target.style.wordSpacing = this.value + 'px';
        styles.wordSpacing = this.value + 'px';
    }
    //insert text block
    headers.push(textHeader);
    bodies.push(textBody);
    //border block
    let borderHeader = doc.createElement('div');
    let borderBody = doc.createElement('div');
    let borderList = doc.createElement('ul');
    borderBody.appendChild(borderList);
    borderHeader.textContent = 'Border';
    borderHeader.classList.add('tab-header');
    borderBody.classList.add('tab-body');
    borderHeader.onclick = function(e)
    {
        disableActive();
        borderBody.classList.add('active-tab');
    }
    let borderTopLeftRadiusItem = doc.createElement('li');
    let borderTopLeftRadius = doc.createElement('input');
    borderTopLeftRadius.type = 'range';
    borderList.appendChild(borderTopLeftRadiusItem);
    borderTopLeftRadiusItem.textContent = 'Radius top-left: ';
    borderTopLeftRadiusItem.appendChild(borderTopLeftRadius);
    borderTopLeftRadius.min = '0';
    borderTopLeftRadius.max = '100';
    borderTopLeftRadius.value = '15';
    borderTopLeftRadius.oninput = function(e)
    {
        target.style.borderTopLeftRadius = this.value + 'px';
        styles.borderTopLeftRadius = this.value + 'px';
    }
    let borderTopRightRadiusItem = doc.createElement('li');
    let borderTopRightRadius = doc.createElement('input');
    borderTopRightRadius.type = 'range';
    borderList.appendChild(borderTopRightRadiusItem);
    borderTopRightRadiusItem.textContent = 'Radius top-right: ';
    borderTopRightRadiusItem.appendChild(borderTopRightRadius);
    borderTopRightRadius.min = '0';
    borderTopRightRadius.max = '100';
    borderTopRightRadius.value = '15';
    borderTopRightRadius.oninput = function(e)
    {
        target.style.borderTopRightRadius = this.value + 'px';
        styles.borderTopRightRadius = this.value + 'px';
    }
    let borderBottomRightRadiusItem = doc.createElement('li');
    let borderBottomRightRadius = doc.createElement('input');
    borderBottomRightRadius.type = 'range';
    borderList.appendChild(borderBottomRightRadiusItem);
    borderBottomRightRadiusItem.textContent = 'Radius bottom-right: ';
    borderBottomRightRadiusItem.appendChild(borderBottomRightRadius);
    borderBottomRightRadius.min = '0';
    borderBottomRightRadius.max = '100';
    borderBottomRightRadius.value = '15';
    borderBottomRightRadius.oninput = function(e)
    {
        target.style.borderBottomRightRadius = this.value + 'px';
        styles.borderBottomRightRadius = this.value + 'px';
    }
    let borderBottomLeftRadiusItem = doc.createElement('li');
    let borderBottomLeftRadius = doc.createElement('input');
    borderBottomLeftRadius.type = 'range';
    borderList.appendChild(borderBottomLeftRadiusItem);
    borderBottomLeftRadiusItem.textContent = 'Radius bottom-left: ';
    borderBottomLeftRadiusItem.appendChild(borderBottomLeftRadius);
    borderBottomLeftRadius.min = '0';
    borderBottomLeftRadius.max = '100';
    borderBottomLeftRadius.value = '15';
    borderBottomLeftRadius.oninput = function(e)
    {
        target.style.borderBottomLeftRadius = this.value + 'px';
        styles.borderBottomLeftRadius = this.value + 'px';
    }
    let borderColorItem = doc.createElement('li');
    let borderColor = doc.createElement('input');
    borderColor.type = 'color';
    borderColorItem.textContent = 'Color: ';
    borderColorItem.appendChild(borderColor);
    borderColor.oninput = function(e)
    {
        target.style.borderColor = this.value;
        styles.borderColor = this.value;
    }
    borderList.appendChild(borderColorItem);
    let borderWidthItem = doc.createElement('li');
    let borderWidth = doc.createElement('input');
    borderWidth.type = 'range';
    borderWidth.min = '0';
    borderWidth.max = '10';
    borderWidth.value = '1';
    borderWidthItem.textContent = 'Width: ';
    borderWidthItem.appendChild(borderWidth);
    borderWidth.oninput = function(e)
    {
        target.style.borderWidth = this.value + 'px';
        styles.borderWidth = this.value + 'px';
    }
    borderList.appendChild(borderWidthItem);
    //insert border block
    headers.push(borderHeader);
    bodies.push(borderBody);
    //Content block
    let contentHeader = doc.createElement('div');
    let contentBody = doc.createElement('div');
    let contentList = doc.createElement('ul');
    contentHeader.textContent = 'Content';
    contentBody.classList.add('tab-body');
    contentHeader.classList.add('tab-header');
    contentHeader.onclick = function(e)
    {
        disableActive();
        contentBody.classList.add('active-tab');
    }
    contentBody.appendChild(contentList);
    //Padding Top
    let paddingTopItem = doc.createElement('li');
    let paddingTop = doc.createElement('input');
    paddingTop.type = 'range';
    paddingTop.min = '0';
    paddingTop.max = '50';
    paddingTop.value = '15';
    paddingTopItem.textContent = 'Padding Top: ';
    paddingTopItem.appendChild(paddingTop);
    paddingTop.oninput = function(e)
    {
        target.style.paddingTop = this.value + 'px';
        styles.paddingTop = this.value + 'px';
    }
    contentList.appendChild(paddingTopItem);
    //Padding Left
    let paddingLeftItem = doc.createElement('li');
    let paddingLeft = doc.createElement('input');
    paddingLeft.type = 'range';
    paddingLeft.min = '0';
    paddingLeft.max = '50';
    paddingLeft.value = '15';
    paddingLeftItem.textContent = 'Padding Left: ';
    paddingLeftItem.appendChild(paddingLeft);
    paddingLeft.oninput = function(e)
    {
        target.style.paddingLeft = this.value + 'px';
        styles.paddingLeft = this.value + 'px';
    }
    contentList.appendChild(paddingLeftItem);
    //Padding Bottom
    let paddingBottomItem = doc.createElement('li');
    let paddingBottom = doc.createElement('input');
    paddingBottom.type = 'range';
    paddingBottom.min = '0';
    paddingBottom.max = '50';
    paddingBottom.value = '15';
    paddingBottomItem.textContent = 'Padding Bottom: ';
    paddingBottomItem.appendChild(paddingBottom);
    paddingBottom.oninput = function(e)
    {
        target.style.paddingBottom = this.value + 'px';
        styles.paddingBottom = this.value + 'px';
    }
    contentList.appendChild(paddingBottomItem);
    //Padding Right
    let paddingRightItem = doc.createElement('li');
    let paddingRight = doc.createElement('input');
    paddingRight.type = 'range';
    paddingRight.min = '0';
    paddingRight.max = '50';
    paddingRight.value = '15';
    paddingRightItem.textContent = 'Padding Right: ';
    paddingRightItem.appendChild(paddingRight);
    paddingRight.oninput = function(e)
    {
        target.style.paddingRight = this.value + 'px';
        styles.paddingRight = this.value + 'px';
    }
    contentList.appendChild(paddingRightItem);
    //Content position
    let positionItem = doc.createElement('li');
    let position = doc.createElement('select');
    let positionCenter = doc.createElement('option');
    positionCenter.textContent = 'center';
    position.appendChild(positionCenter);
    let positionLeft = doc.createElement('option');
    positionLeft.textContent = 'left';
    position.appendChild(positionLeft);
    let positionRight = doc.createElement('option');
    positionRight.textContent = 'right';
    position.appendChild(positionRight);
    positionItem.textContent = 'Content position: ';
    positionItem.appendChild(position);
    contentList.appendChild(positionItem);
    position.onchange = function(e)
    {
        target.style.textAlign = this.value;
        styles.textAlign = this.value;
    }
    //Width
    let blockWidthItem = doc.createElement('li');
    let blockWidth = doc.createElement('input');
    blockWidthItem.textContent = 'Width: ';
    blockWidth.type = 'range';
    blockWidth.min = '0';
    blockWidth.max = innerWidth;
    blockWidth.value = target.clientWidth;
    blockWidth.oninput = function(e)
    {
        target.style.width = this.value + 'px';
        styles.width = this.value + 'px';
    }
    blockWidthItem.appendChild(blockWidth);
    contentList.appendChild(blockWidthItem);
    //Height
    let blockHeightItem = doc.createElement('li');
    let blockHeight = doc.createElement('input');
    blockHeightItem.textContent = 'Height: ';
    blockHeight.type = 'range';
    blockHeight.min = '0';
    blockHeight.max = innerHeight;
    blockHeight.value = target.clientHeight;
    blockHeight.oninput = function(e)
    {
        target.style.height = this.value + 'px';
        styles.height = this.value + 'px';
    }
    blockHeightItem.appendChild(blockHeight);
    contentList.appendChild(blockHeightItem);
    //================================================insert content block================================================
    headers.push(contentHeader);
    bodies.push(contentBody);
    //Animation Block
    let animationHeader = doc.createElement('div');
    let animationBody = doc.createElement('div');
    let animationList = doc.createElement('ul');
    animationBody.appendChild(animationList);
    animationHeader.textContent = 'Animation';
    animationHeader.classList.add('tab-header');
    animationBody.classList.add('tab-body');
    animationHeader.onclick = function(e)
    {
        disableActive();
        animationBody.classList.add('active-tab');
    }
    let transitionItem = doc.createElement('li');
    let transition = doc.createElement('input');
    transition.type = 'range';
    transition.min = '0';
    transition.max = '5000';
    transitionItem.textContent = 'Transition per ms: ';
    transitionItem.appendChild(transition);
    animationList.appendChild(transitionItem);
    transition.oninput = function(e)
    {
        styles.transition = target.style.transition = this.value + 'ms';
    }
    //insert animation block
    headers.push(animationHeader);
    bodies.push(animationBody);
    //===================================================End insert===================================================
    for (const iterator of headers)
    {
        setting.appendChild(iterator);
    }
    for (const iterator of bodies)
    {
        setting.appendChild(iterator);
    }
    let button = doc.createElement('button');
    let cancel = doc.createElement('button');
    button.textContent = 'Set';
    cancel.textContent = 'Remove';
    this.setStyle(button, {
        color: 'black',
        border: '1px solid black',
        width: '75px',
        height: '30px',
        borderRadius: '20px',
        marginLeft: 'calc(50% - 75px)',
    })
    this.setStyle(cancel, {
        color: 'black',
        border: '1px solid black',
        width: '75px',
        height: '30px',
        borderRadius: '20px',
    })
    setting.appendChild(button);
    setting.appendChild(cancel);
    button.onclick = function(e)
    {
        if(stored.indexOf(doc.head.getElementsByTagName('title')[0].textContent + '-' + target.tagName + getIndex(target)) == -1)
        {
            stored.push(doc.head.getElementsByTagName('title')[0].textContent + '-' + target.tagName + getIndex(target));
        }
        sessionStorage.setItem(doc.head.getElementsByTagName('title')[0].textContent + '-stored', JSON.stringify(stored));
        try {
            sessionStorage.setItem(doc.head.getElementsByTagName('title')[0].textContent + '-' + event.target.tagName + getIndex(event.target), JSON.stringify(styles));
        } catch (error) {
            try {
                styles.backgroundImage = 'none';
                sessionStorage.setItem(doc.head.getElementsByTagName('title')[0].textContent + '-' + event.target.tagName + getIndex(event.target), JSON.stringify(styles));
            } catch (error) {}
        }
        doc.body.removeChild(setting);
        delete window.setting;
    }
    cancel.onclick = function(e)
    {
        target.removeAttribute('style');
        doc.body.removeChild(setting);
        delete window.setting;
    }
    this.doc.body.appendChild(setting);
}

window.addEventListener('load', function(event)
{
    loadEndFrom = Date.now();
    console.log(loadEndFrom - loadStartFrom);
    if(loadEndFrom - loadStartFrom >= 1500)
    {
        try {
            this.doc.body.removeChild(doc.getElementById('preloader')); 
            doc.body.style.overflowY = 'auto';
        } catch (error) {}
    }
    else
    {
        let t = this.setTimeout(()=>{
            try {
                this.doc.body.removeChild(doc.getElementById('preloader')); 
                doc.body.style.overflowY = 'auto';
            } catch (error) {}
            this.clearTimeout(t);
        }, 1500 - (loadEndFrom - loadStartFrom));
    }
})