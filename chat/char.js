var doc = document, math = Math;
var users = [];
var create = doc.getElementById('create-block');
var updateTarget;
var aboutFieldOpened = false;
var runtime = false;
var authorContactBlock = doc.getElementById('author-contacts');
var map = doc.getElementById('map-block');
map.innerHTML += '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2906.776266918755!2d76.90755611486478!3d43.23515028738134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3883692f027581ad%3A0x2426740f56437e63!2z0JzQtdC20LTRg9C90LDRgNC-0LTQvdGL0Lkg0YPQvdC40LLQtdGA0YHQuNGC0LXRgiDQuNC90YTQvtGA0LzQsNGG0LjQvtC90L3Ri9GFINGC0LXRhdC90L7Qu9C-0LPQuNC5!5e0!3m2!1sru!2skz!4v1589293186255!5m2!1sru!2skz" id="google-map"></iframe>';
authorContactBlock.style.display = 'none';
map.style.display = 'none';
if(localStorage.getItem('My-Room-users') != null)
{
    users = JSON.parse(localStorage.getItem('My-Room-users'));
}

function setClass(array = [], cls = '')
{
    for (let i = 0; i < array.length; i++)
    {
        array[i].classList.add(cls);
    }
}

function setAttr(array, attribute, value)
{
    for (let i = 0; i < array.length; i++)
    {
        array[i].setAttribute(attribute, value);
    }
}

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

function User(mail, name, surname, password, keyword, gender, about)
{
    this.Mail = mail;
    this.Name = name;
    this.Surname = surname;
    this.Password = password;
    this.Keyword = keyword;
    this.Gender = gender;
    this.About = about;
    this.isEnable = true;
}

function createGallery(index)
{
    let block = doc.createElement('div');
    let header = doc.createElement('h1');
    let list = doc.createElement('ul');
    let li = [doc.createElement('li'), doc.createElement('li'), doc.createElement('li')];
    let imageBlock = doc.createElement('div');
    imageBlock.classList.add('mini-images');
    let images = [];
    block.classList.add('other-user');
    block.appendChild(header);
    if(sessionStorage.getItem('admin') == 'true')
    {
        let userBlock = users[index];
        let disable = doc.createElement('button');
        let update = doc.createElement('button');
        let remove = doc.createElement('button');
        update.classList.add('control-button');
        disable.classList.add('control-button');
        remove.classList.add('control-button');
        update.textContent = "Update";
        disable.textContent = "Disable";
        remove.textContent = "Remove";
        disable.onclick = function(e)
        {
            userBlock.isEnable = !userBlock.isEnable;
            localStorage.setItem('My-Room-users', JSON.stringify(users));
            if(userBlock.isEnable)
            {
                disable.textContent = 'Disable';
            }
            else
            {
                disable.textContent = 'Enable';
            }
        }
        remove.onclick = function(e)
        {
            localStorage.removeItem(userBlock.Name + ' mini image');
            localStorage.removeItem(userBlock.Name + ' catch red');
            localStorage.removeItem(userBlock.Name + ' catch rithm');
            users.splice(users.indexOf(userBlock), 1);
            function RemoveFromSession(obj)
            {
                console.log(obj.children);
                for (const iterator of obj.children)
                {
                    if(iterator.children.length > 0)
                    {
                        RemoveFromSession(iterator);
                    }
                    sessionStorage.removeItem(doc.head.getElementsByTagName('title')[0].textContent + '-' + iterator.tagName + getIndex(iterator));
                    console.log(doc.head.getElementsByTagName('title')[0].textContent + '-' + iterator.tagName + getIndex(iterator));
                }
                sessionStorage.removeItem(doc.head.getElementsByTagName('title')[0].textContent + '-' + obj.tagName + getIndex(obj));
            }
            RemoveFromSession(block);
            block.remove();
            localStorage.setItem('My-Room-users', JSON.stringify(users));
        }
        update.onclick = function(e)
        {
            doc.getElementById('update-email').value = userBlock.Mail;
            doc.getElementById('update-name').value = userBlock.Name;
            doc.getElementById('update-surname').value = userBlock.Surname;
            doc.getElementById('update-password').value = userBlock.Password;
            doc.getElementById('update-keyword').value = userBlock.Keyword;
            if(userBlock.Gender == 'Male')
            {
                doc.getElementById('update-male').checked = true;
            }
            else
            {
                doc.getElementById('update-female').checked = false;
            }
            doc.getElementById('update-about').value = userBlock.About;
            doc.getElementById('update-user-block').style.display = 'block';
            updateTarget = userBlock;
        }
        block.append(remove, update, disable);
    }
    header.textContent = users[index].Name + ' ' + users[index].Surname;
    header.classList.add('user-name');
    doc.body.insertBefore(block, doc.getElementById('create-block'));
    if(localStorage.getItem(users[index].Name + ' mini image') !== null)
    {
        images = JSON.parse(localStorage.getItem(users[index].Name + ' mini image')) || [];
        let img = new Array(images.length);
        for (let i = 0; i < img.length; i++)
        {
            img[i] = doc.createElement('img');
            img[i].src = images[i];
        }
        for (let i = 0; i < img.length; i++)
        {
            imageBlock.appendChild(img[i]);
        }
        setClass(img, 'user-image');
        block.appendChild(imageBlock);
    }
    block.appendChild(list);
    list.classList.add('user-score-list');
    list.append(li[0], li[1], li[2]);
    setClass(li, 'games-score');
    li[0].classList.add('catch-red');
    li[1].classList.add('catch-rithm');
    li[2].classList.add('correct-the-sentence');
    li[0].textContent = (!localStorage.getItem(users[index].Name + ' catch red')) ? "Catch Red: Not pass" : "Catch Red: " + localStorage.getItem(users[index].Name + ' catch red')/1000 + 's';
    li[1].textContent = (!localStorage.getItem(users[index].Name + ' catch rithm')) ? "Catch Rythm: Not pass" : "Catch Rythm: " + localStorage.getItem(users[index].Name + ' catch rithm');
    li[2].textContent = (!localStorage.getItem(users[index].Name + ' correct the sentence')) ? "Correct the sentence: Not pass" : "Correct the sentence: " + localStorage.getItem(users[index].Name + ' correct the sentence');
    if(users[index].Mail == JSON.parse(sessionStorage.getItem('this-user')).Mail)
    {
        block.style.borderColor = 'darkblue';
    }
    if(users[index].About.length !== 0)
    {
        let aboutUser = doc.createElement('div');
        aboutUser.classList.add('about-user');
        aboutUser.textContent = users[index].About;
        block.appendChild(aboutUser);
    }
}

function removeGallery(index)
{
    let other = doc.getElementsByClassName('other-user');
    for (let i = 0; i < other.length; i++)
    {
        if(other[i].getElementsByClassName('user-name')[0].textContent == users[index].Name + ' ' + users[index].Surname)
        {
            doc.body.removeChild(other[i]);
            return;
        }
    }
}

(()=>
{
    if(sessionStorage.getItem('admin') == 'true')
    {
        create.style.display = 'block';
    }
    else
    {
        create.style.display = 'none';
    }
    for (let i = 0; i < users.length; i++)
    {
        createGallery(i);
    }
})()

create.onclick = function(event)
{
    //X Æ A-12
    let user = doc.getElementById('new-user-block');
    user.style.display = 'block';
}

doc.getElementById('submit').onclick = function(event)
{
    let mail = doc.getElementById('user-email');
    let name = doc.getElementById('user-name');
    let surname = doc.getElementById('user-surname');
    let password = doc.getElementById('user-password');
    let repassword = doc.getElementById('user-re-password');
    let male = doc.getElementById('male');
    let female = doc.getElementById('female');
    let regMail = /.+\@\w+\.\w+/.test(mail.value) && /[^\s]/.test(mail.value);
    let regName = /^[A-Z]/.test(name.value) && /[^\s]/.test(name.value);
    let regSur = /^[A-Z]/.test(surname.value) && /[^\s]/.test(surname.value);
    let regPass = /([a-zA-Z]+\d+|\d+[a-zA-Z]+)/.test(password.value) && /[^\s]/.test(password.value);
    let passRegis = true;
    if(!regMail)
    {
        mail.style.borderColor = 'red';
        passRegis = false;
    }
    else
    {
        mail.style.borderColor = 'blue';
    }
    if(!regName)
    {
        name.style.borderColor = 'red';
        passRegis = false;
    }
    else
    {
        name.style.borderColor = 'blue';
    }
    if(!regSur)
    {
        surname.style.borderColor = 'red';
        passRegis = false;
    }
    else
    {
        surname.style.borderColor = 'blue';
    }
    if(!regPass || password.length < 8)
    {
        password.style.borderColor = 'red';
        passRegis = false;
    }
    else
    {
        password.style.borderColor = 'blue';
    }
    if(password.value != repassword.value || !regPass)
    {
        repassword.style.borderColor = 'red';
        passRegis = false;
    }
    else
    {
        repassword.style.borderColor = 'blue';
    }
    if(!male.checked && !female.checked)
    {
        male.style.borderColor = 'red';
        female.style.borderColor = 'red';
        passRegis = false;
    }
    else
    {
        male.style.borderColor = 'blue';
        female.style.borderColor = 'blue';
    }
    if(passRegis)
    {
        doc.getElementById('new-user-block').style.display = 'none';
        if(!findObject(users, new User(mail.value, name.value, surname.value, password.value, doc.getElementById('keyword').value, male.checked ? 'Male' : 'Female', doc.getElementById('about').value)))
        {
            users.push(new User(mail.value, name.value, surname.value, password.value, doc.getElementById('keyword').value, male.checked ? 'Male' : 'Female', doc.getElementById('about').value))
            localStorage.setItem('My-Room-users', JSON.stringify(users));
            createGallery(users.length - 1);
        }
        mail.value = '';
        name.value = '';
        surname.value = '';
        password.value = '';
        repassword.value = '';
        doc.getElementById('keyword').value = '';
        male.checked = false;
        female.checked = false;
        doc.getElementById('about').value = '';
    }
}

doc.getElementById('cancel').onclick = function(event)
{
    doc.getElementById('user-email').value = '';
    doc.getElementById('user-name').value = '';
    doc.getElementById('user-surname').value = '';
    doc.getElementById('user-password').value = '';
    doc.getElementById('user-re-password').value = '';
    doc.getElementById('keyword').value = '';
    doc.getElementById('male').checked = false;
    doc.getElementById('female').checked = false;
    doc.getElementById('about').value = '';
    doc.getElementById('new-user-block').style.display = 'none';
}

doc.getElementById('update-submit').onclick = function(event)
{
    let mail = doc.getElementById('update-email');
    let name = doc.getElementById('update-name');
    let surname = doc.getElementById('update-surname');
    let password = doc.getElementById('update-password');
    let male = doc.getElementById('update-male');
    let female = doc.getElementById('update-female');
    let regMail = /.+\@\w+\.\w+/.test(mail.value) && /[^\s]/.test(mail.value);
    let regName = /^[A-Z]/.test(name.value) && /[^\s]/.test(name.value);
    let regSur = /^[A-Z]/.test(surname.value) && /[^\s]/.test(surname.value);
    let regPass = /([a-zA-Z]+\d+|\d+[a-zA-Z]+)/.test(password.value) && /[^\s]/.test(password.value);
    let passRegis = true;
    if(regMail)
    {
        mail.style.borderColor = 'blue';
    }
    else
    {
        mail.style.borderColor = 'red';
        passRegis = false;
    }
    if(regName)
    {
        name.style.borderColor = 'blue';
    }
    else
    {
        name.style.borderColor = 'red';
        passRegis = false;
    }
    if(regSur)
    {
        surname.style.borderColor = 'blue';
    }
    else
    {
        surname.style.borderColor = 'red';
        passRegis = false;
    }
    if(regPass && password.value.length >= 8)
    {
        password.style.borderColor = 'blue';
    }
    else
    {
        password.style.borderColor = 'red';
        passRegis = false;
    }
    if(!(male.checked || female.checked))
    {
        password.style.borderColor = 'red';
        passRegis = false;
    }
    if(passRegis)
    {
        removeGallery(users.indexOf(updateTarget));
        let temp = JSON.parse(localStorage.getItem(users[users.indexOf(updateTarget)].Name + ' mini image'));
        localStorage.removeItem(users[users.indexOf(updateTarget)].Name + ' mini image');
        updateTarget.Name = name.value;
        updateTarget.Surname = surname.value;
        updateTarget.Mail = mail.value;
        updateTarget.Password = password.value;
        updateTarget.Gender = male.checked ? "Male" : "Female";
        updateTarget.Keyword = doc.getElementById('update-keyword').value;
        updateTarget.About = doc.getElementById('update-about').value;
        localStorage.setItem('My-Room-users', JSON.stringify(users));
        mail.value = '';
        name.value = '';
        surname.value = '';
        password.value = '';
        doc.getElementById('update-keyword').value = '';
        male.checked = false;
        female.checked = false;
        doc.getElementById('update-about').value = '';
        doc.getElementById('update-user-block').style.display = 'none';
        localStorage.setItem(updateTarget.Name + ' mini image', JSON.stringify(temp));
        createGallery(users.indexOf(updateTarget));
    }
}

doc.getElementById('update-cancel').onclick = function(event)
{
    doc.getElementById('update-email').value = '';
    doc.getElementById('update-name').value = '';
    doc.getElementById('update-surname').value = '';
    doc.getElementById('update-password').value = '';
    doc.getElementById('update-keyword').value = '';
    doc.getElementById('update-male').checked = false;
    doc.getElementById('update-female').checked = false;
    doc.getElementById('update-about').value = '';
    doc.getElementById('update-user-block').style.display = 'none';
}

doc.querySelector('#author-logo').onclick = function(event)
{
    if(!runtime)
    {
        let elem = doc.querySelector('.about-authors');
        runtime = true;
        if(!aboutFieldOpened)
        {
            elem.style.animation = 'open 1s cubic-bezier(.59,-0.29,.07,1.5)';
            doc.getElementById('author-logo').textContent += 'IITU 2020 Almaty|Kassymbekov Abdussattar and Assem Zeinekhanova';
            setTimeout(() => {
                elem.style.animation = 'none';
                elem.classList.add('opened');
                map.style.display = 'block';
                authorContactBlock.style.display = 'block';
                runtime = false;
            }, 970);
        }
        else
        {
            map.style.display = 'none';
            authorContactBlock.style.display = 'none';
            elem.style.animation = 'open 1s cubic-bezier(.55,-0.27,0,1.38) reverse';
            setTimeout(() => {
                elem.style.animation = 'none';
                elem.classList.remove('opened');
                doc.getElementById('author-logo').innerHTML = '&copy;';
                runtime = false;
            }, 970);
        }
        aboutFieldOpened = !aboutFieldOpened;
    }
}