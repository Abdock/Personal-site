var doc = document, math = Math;
var preloaderBlock = doc.createElement('figure');
if(navigator.userAgent.indexOf('Mobile') > -1)
{
    preloaderBlock.textContent = 'Click on any item 3 times.';
}
else
{
    preloaderBlock.textContent = 'Click on any item with \"Shift\" + \"CTRL\" + left-click to bring up the style menu.';
}
preloaderBlock.id = 'preloader';
doc.body.appendChild(preloaderBlock);
doc.body.style.overflowY = 'hidden';
var preloaderLine = doc.createElement('figure');
var loadStartFrom = Date.now();
preloaderLine.id = 'preloader-line';
preloaderBlock.appendChild(preloaderLine);