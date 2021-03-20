var doc = document, math = Math;
var beginString = "";
var findString = beginString.slice(0, beginString.length);
var left = 0, right = findString.length - 1;
const random = (a, b)=>{return math.random() * (b - a) + a; };
var wasIndex = [];
var selected = 0;
var counter = 0;
var Winner = false;
var words = ['Initialization', 'Allocation', 'Organization', 'Hello World', 'Delete', 'Left-Click', 'Multimedia', 'SerialNumber', 'Apple', 'Boot', 'Character', 'Column', 'Default', 'DoubleClick', 'Downtime', 'Drag', 'Field', 'Font', 'Input', 'Keystroke', 'Macintosh', 'Network', 'Online', 'Output', 'Password', 'Swipe', 'Troubleshooting', 'UserExperience', 'UserID', 'User-Friendly', 'Wireless', 'AspectRatio', 'Authentication', 'Binary', 'Burn', 'CapsLock', 'Configuration', 'Copyright', 'Crop', 'Digital', 'E-learning', 'Filter', 'Footer', 'Gigahertz', 'Graphics', 'Grayscale', 'Hacker', 'Header', 'Hertz', 'Integer', 'LogOn', 'Login', 'Megahertz', 'Megapixel', 'NaturalNumber', 'Offline', 'Overwrite', 'Pixel', 'Plagiarism', 'Port', 'RightClick', 'SpeechRecognition', 'Table', 'TextAlignment', 'Username', 'Variable', 'Wired', 'Analog', 'ArtificialIntelligence', 'Autocomplete', 'Bluetooth', 'ColdBoot', 'ComputerScience', 'Constant', 'Cybercrime', 'Developer', 'Digitize', 'Ergonomics', 'Format', 'Frame', 'Frequency', 'HardCopy', 'Hover', 'Keywords', 'Kilohertz', 'Margin', 'Mobile', 'Newbie', 'Passcode', 'Passphrase', 'RationalNumber', 'Read-only', 'Refresh', 'Rendering', 'Resolution', 'Restore'];

(()=>{
    let cnt = math.round(random(1, 10));
    let was = [];
    while(cnt--)
    {
        let index = math.round(random(0, words.length - 1));
        while(was.indexOf(index) > -1)
        {
            index = math.round(random(0, words.length - 1));
        }
        beginString += words[index] + ' ';
        was.push(index);
    }
    beginString = beginString.slice(0, beginString.length - 1);
    findString = beginString.slice(0, beginString.length);
    doc.getElementById('show-word').textContent = findString;
    setTimeout(()=>{
        doc.getElementById('show-word').style.display = 'none';
        left = 0, right = findString.length - 1;
        exchangeLetters();
    }, 500)
})()

function exchangeLetters()
{
    for (let i = 0; i < findString.length; i++)
    {
        let span = doc.createElement('span');
        span.textContent = findString[i];
        if(i == 0)
        {
            span.classList.add('left');
        }
        else if(i == findString.length - 1)
        {
            span.classList.add('right');
        }
        if(/[a-zA-Z]/.test(span.textContent))
        {
            span.onclick = function(event)
            {
                if(selected == 1 && !span.classList.contains('right') && !span.classList.contains('left'))
                {
                    removeClassFrom(doc.getElementById('text-area').children, 'left');
                    span.classList.add('left');
                    left = i;
                    counter++;
                }
                else if(selected == 2 && !span.classList.contains('right') && !span.classList.contains('left'))
                {
                    removeClassFrom(doc.getElementById('text-area').children, 'right');
                    span.classList.add('right');
                    right = i;
                    counter++;
                }
            }
        }
        doc.getElementById('text-area').appendChild(span);
    }

    for (let i = 0; i < doc.getElementById('text-area').children.length; i++)
    {
        let index = math.round(random(0, findString.length - 1));
        while(wasIndex.indexOf(index) > -1)
        {
            index = math.round(random(0, findString.length - 1));
        }
        let thisItem = doc.getElementById('text-area').children[i];
        let randItem = doc.getElementById('text-area').children[index];
        if(/[a-zA-Z]/.test(thisItem.textContent) && /[a-zA-Z]/.test(randItem.textContent))
        {
            let t = thisItem.textContent;
            thisItem.textContent = randItem.textContent;
            randItem.textContent = t;
        }
        wasIndex.push(index);
    }
}

function removeClassFrom(where, which)
{
    for (let i = 0; i < where.length; i++)
    {
        where[i].classList.remove(which);
    }
}

window.onkeydown = function(event)
{
    if(this.Winner)
    {
        return false;
    }
    if(event.code == 'ArrowRight')
    {
        this.removeClassFrom(doc.getElementById('text-area').children, 'right');
        do {
            right++;
            if(right == this.findString.length)
            {
                right = 0;
            }
        } while (right == left || this.findString[right] == ' ');
        this.doc.getElementById('text-area').children[right].classList.add('right');
        this.counter++;
    }
    else if(event.code == 'ArrowLeft')
    {
        this.removeClassFrom(doc.getElementById('text-area').children, 'right');
        do {
            right--;
            if(right == -1)
            {
                right = this.findString.length - 1;
            }
        } while (right == left || this.findString[right] == ' ');
        this.doc.getElementById('text-area').children[right].classList.add('right');
        this.counter++;
    }
    if(event.code == 'KeyD')
    {
        this.removeClassFrom(doc.getElementById('text-area').children, 'left');
        do {
            left++;
            if(left == this.findString.length)
            {
                left = 0;
            }
        } while (left == right || this.findString[left] == ' ');
        this.doc.getElementById('text-area').children[left].classList.add('left');
        this.counter++;
    }
    else if(event.code == 'KeyA')
    {
        this.removeClassFrom(doc.getElementById('text-area').children, 'left');
        do {
            left--;
            if(left == -1)
            {
                left = this.findString.length - 1;
            }
        } while (left == right || this.findString[left] == ' ');
        this.doc.getElementById('text-area').children[left].classList.add('left');
        this.counter++;
    }
    if(event.code == 'Space')
    {
        let userString = '';
        for (const item of doc.getElementById('text-area').children)
        {
            userString += item.textContent;
        }
        if(userString == beginString)
        {
            alert("You win");
            this.Winner = true;
            return false;
        }
        localStorage.setItem(sessionStorage.getItem('user-name') + ' correct the sentence', this.counter);
        let x = doc.getElementById('text-area').children[left].textContent;
        doc.getElementById('text-area').children[left].textContent = doc.getElementById('text-area').children[right].textContent;
        doc.getElementById('text-area').children[right].textContent = x;
        userString = '';
        for (const item of doc.getElementById('text-area').children)
        {
            userString += item.textContent;
        }
        if(userString == beginString)
        {
            alert("You win");
            this.Winner = true;
            return false;
        }
        localStorage.setItem(sessionStorage.getItem('user-name') + ' correct the sentence', this.counter);
    }
}

doc.getElementById('left-button').onclick = function(event)
{
    selected = 1;
}

doc.getElementById('right-button').onclick = function(event)
{
    selected = 2;
}

doc.getElementById('change-button').onclick = function(event)
{
    let userString = '';
    for (const item of doc.getElementById('text-area').children)
    {
        userString += item.textContent;
    }
    if(userString == beginString)
    {
        alert("You win");
        return false;
    }
    localStorage.setItem(sessionStorage.getItem('user-name') + ' correct the sentence', counter);
    let x = doc.getElementById('text-area').children[left].textContent;
    doc.getElementById('text-area').children[left].textContent = doc.getElementById('text-area').children[right].textContent;
    doc.getElementById('text-area').children[right].textContent = x;
    userString = '';
    for (const item of doc.getElementById('text-area').children)
    {
        userString += item.textContent;
    }
    if(userString == beginString)
    {
        alert("You win");
        return false;
    }
    localStorage.setItem(sessionStorage.getItem('user-name') + ' correct the sentence', counter);
}