var doc = document, math = Math;
var message = doc.getElementById('message-block');
var reg = doc.getElementById('registration-block');
var image = doc.getElementById('image-block');
var inReg = false;
var correct = 3;
var users = [];
var messages = JSON.parse(localStorage.getItem('My-Room-users-messages')) || [];
if(localStorage.getItem('My-Room-users') !== null)
{
    users = JSON.parse(localStorage.getItem('My-Room-users'));
}
message.style.display = 'none';
image.style.display = 'none';
doc.getElementById('exit').style.display = 'none';

function findObject(array, object)
{
    for (let i = 0; i < array.length; i++)
    {
        if(JSON.stringify(array[i]) == JSON.stringify(object))
        {
            return true;
        }
    }
    return false;
}

function displayMessage()
{
    doc.getElementById('to-reg-log').style.display = 'none';
    doc.getElementById('exit').style.display = 'inline-block';
    reg.style.display = 'none';
    message.style.display = 'inline-block';
    doc.getElementById('message-input').placeholder = "Hello " + JSON.parse(sessionStorage.getItem('this-user')).Name + ", send message to other users";
}

function displayImage()
{
    if(sessionStorage.getItem('image1') === null)
    {
        return false;
    }
    image.style.display = 'inline-block';
    let i = 1;
    while(sessionStorage.getItem('image' + i) !== null)
    {
        let img = doc.createElement('img');
        img.src = sessionStorage.getItem('image' + i);
        img.classList.add('image-from-galery');
        image.appendChild(img);
        i++;
    }
}

window.onload = function(event)
{
    if(sessionStorage.getItem('pass-registration') == 'true')
    {
        this.displayMessage();
        this.displayImage();
        for (let i = 0; i < messages.length; i++)
        {
            updateMessageBlock(i);
        }
        // doc.body.onresize();
    }
}

doc.getElementById('submit').onclick = function(event)
{
    let name = doc.getElementById('user-name').value;
    let pass = doc.getElementById('user-pass').value;
    let nameEr = doc.getElementById('name-error');
    let FindUser = false;
    let passEr = doc.getElementById('pass-error');
    if(name == 'Admin@admin.site' && pass == 'Password123')
    {
        sessionStorage.clear();
        sessionStorage.setItem('pass-registration', 'true');
        sessionStorage.setItem('this-user', JSON.stringify({Name: name, Password: pass}));
        sessionStorage.setItem('admin', 'true');
        displayMessage();
        displayImage();
        if(doc.getElementById('message-block').hasChildNodes())
        {
            for (const iterator of doc.getElementById('message-block').children)
            {
                iterator.remove();
            }
        }
        for (let i = 0; i < messages.length; i++)
        {
            updateMessageBlock(i);
        }
        return;
    }

    for (let i = 0; i < users.length; i++)
    {
        if(users[i].Mail == name)
        {
            FindUser = true;
            if(users[i].Password == pass)
            {
                if(users[i].isEnable)
                {
                    sessionStorage.clear();
                    sessionStorage.setItem('pass-registration', 'true');
                    sessionStorage.setItem('this-user', JSON.stringify(users[i]));
                    sessionStorage.setItem('admin', 'false');
                    displayMessage();
                    displayImage();
                    if(doc.getElementById('message-block').hasChildNodes())
                    {
                        for (const iterator of doc.getElementById('message-block').children)
                        {
                            iterator.remove();
                        }
                    }
                    for (let i = 0; i < messages.length; i++)
                    {
                        updateMessageBlock(i);
                    }
                }
                else
                {
                    alert('Your account is disabled');
                }
                break;
            }
            else
            {
                passEr.style.color = 'red';
                passEr.style.fontSize = '1.1em';
                passEr.textContent = 'This user use other password.';
                break;
            }
        }
    }
    if(!FindUser)
    {
        nameEr.style.color = 'red';
        nameEr.style.fontSize = '1.1em';
        nameEr.textContent = 'This user is not pass registration';
    }
    return false;
}

function Exit()
{
    doc.getElementById('to-reg-log').style.display = 'inline-block';
    this.message.style.display = 'none';
    this.image.style.display = 'none';
    reg.style.display = 'block';
    doc.getElementById('exit').style.display = 'none';
    sessionStorage.setItem('pass-registration', 'false');
}

function Message(email, who, what)
{
    this.Email = email;
    this.Owner = who;
    this.Value = what;
}

function updateMessageBlock(index)
{
    let token = doc.createElement('div');
    let owner = doc.createElement('span');
    let val = doc.createElement('span');
    owner.textContent = messages[index].Owner;
    val.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;' + messages[index].Value;
    token.append(owner, val);
    owner.classList.add('message-owner');
    val.classList.add('message-value');
    if(messages[index].Email == JSON.parse(sessionStorage.getItem('this-user')).Mail)
    {
        token.classList.add('my-message');
    }
    else
    {
        token.classList.add('other-message');
    }
    doc.getElementById('user-messages').appendChild(token);
}

doc.getElementById('message-send').onclick = function SendMessage(event)
{
    messages.push(new Message(JSON.parse(sessionStorage.getItem('this-user')).Mail, JSON.parse(sessionStorage.getItem('this-user')).Name, doc.getElementById('message-input').value));
    localStorage.setItem('My-Room-users-messages', JSON.stringify(messages));
    doc.getElementById('message-input').value = '';
    updateMessageBlock(messages.length - 1);
}

doc.getElementById('message-input').onkeypress = function(event)
{
    if(event.key == 'Enter')
    {
        messages.push(new Message(JSON.parse(sessionStorage.getItem('this-user')).Mail, JSON.parse(sessionStorage.getItem('this-user')).Name, doc.getElementById('message-input').value));
        localStorage.setItem('My-Room-users-messages', JSON.stringify(messages));
        doc.getElementById('message-input').value = '';
        updateMessageBlock(messages.length - 1);
    }
}