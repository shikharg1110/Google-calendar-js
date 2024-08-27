let today = new Date();
let month = today.getMonth();
let year = today.getFullYear();
let day = today.getDay();

const monthEnglish = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


let monthInput = document.getElementById('month');
monthInput.value= monthEnglish[month];

let yearInput = document.getElementById('year');
yearInput.value = year;

let prevBtn = document.getElementById('prev');
prevBtn.addEventListener('click', ()=>  {
    month--;
    if(month === -1) {
        month = 11;
        year--;
    }
    monthInput.value = monthEnglish[month];
    yearInput.value = year;
    calendar();
    editEvent();
})

let nextBtn = document.getElementById('next');
nextBtn.addEventListener('click', ()=>  {
    month++;
    if(month === 12) {
        month = 0;
        year++;
    }
    monthInput.value = monthEnglish[month];
    yearInput.value = year;
    calendar();
    editEvent();
})


let reloadBtn = document.getElementById('reload');
reloadBtn.addEventListener('click', ()=>  {
    window.location.reload();
})

const tbody = document.getElementsByTagName('tbody');

let tr = tbody[0].querySelectorAll('tr');

const calendar = () => {
    let firstDayOfMonth = new Date(year, month, 1).getDay();
    let lastDateOfMonth = new Date(year, month+1, 0).getDate();

    let i = 0;
    for(i = 0; i < lastDateOfMonth + firstDayOfMonth; i++) {
        if(i < firstDayOfMonth) {
            tr[0].querySelectorAll('td')[i].textContent = null;
            tr[0].querySelectorAll('td')[i].classList.add('nullDays');
        }

        else if(i >= 35) {
            let newRow = document.createElement("tr");
            for(let k = 0; k < 7; k++) {
                let newCell = document.createElement('td');
                if(i < lastDateOfMonth + firstDayOfMonth) {
                    newCell.textContent = i - firstDayOfMonth + 1;
                    newCell.setAttribute('dayValue', i-firstDayOfMonth+1);
                }
                else {
                    newCell.textContent = null;
                    newCell.classList.add('nullDays');   
                }
                newRow.appendChild(newCell);
                i++;
            }
            tbody[0].appendChild(newRow);
        }

        else {
            let td = tr[Math.floor((i) / 7)].querySelectorAll('td');
            if(td[i % 7].classList.contains('nullDays')) {
                td[i % 7].classList.remove('nullDays');
            }
            if(i-firstDayOfMonth+1 <= lastDateOfMonth) {
                td[(i) % 7].textContent = i - firstDayOfMonth + 1;
                td[i%7].setAttribute('dayValue', i-firstDayOfMonth+1);
            }
            else
                td[(i) % 7].textContent = null;
        }

        while(i >= lastDateOfMonth+firstDayOfMonth-1 && i < 35) {
            if(i == lastDateOfMonth+firstDayOfMonth-1) {
                i++;
            }
            else {
                let td = tr[Math.floor((i) / 7)].querySelectorAll('td');
                td[i % 7].classList.add('nullDays');
                td[i%7].textContent = null;
                i++;
            }
        }
    }
    if(!((firstDayOfMonth > 4 && lastDateOfMonth == 31) || (firstDayOfMonth > 5 && lastDateOfMonth == 30))) {
        // delete the last row

        let tr5 = tbody[0].querySelectorAll('tr');
        if(tr5[5]) {
            tbody[0].deleteRow(-1);
        }
        if(tr5[tr5.length-1]) {
            let td5 = tr5[tr5.length-1].querySelectorAll('td');
            let j = 0;
            while( j < td5.length) {
                if(td5[j].textContent == lastDateOfMonth) {
                    j++;
                    while(j < td5.length) {
                        td5[j].textContent = null;
                        j++;
                    }
                }
                j++;
            }
        }
    }
    editEvent();
    checkEvent();
}
calendar();
handleClick();
checkEvent();
editEvent();

function handleClick () {
    let tdClick = document.querySelectorAll('td');
    tdClick.forEach(cell => {
        cell.addEventListener('click', ()=> {
            if(cell.classList.contains('nullDays') == false) {
                let myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
                let heading = document.getElementById('exampleModalLabel');
                let doc =  cell.getAttribute('dayValue') + "/" + (month) + "/" + year;
                heading.textContent = 'Event on ' + doc;
                myModal.show();
            }
        })
    })
}

const saveChanges = document.getElementById('saveChanges');
saveChanges.addEventListener('click', () => {
    
    let heading = document.getElementById('exampleModalLabel');
    let inputTitle = document.getElementById('inputTitle');
    let inputDesc = document.getElementById('inputDesc');
    let inputTime = document.getElementById('inputTime');
    let obj = {
        "title": inputTitle.value,
        "description": inputDesc.value,
        "timing": inputTime.value
    }
    let key = heading.textContent.split(' ')[2];
    let existingArray = localStorage.getItem(key);
    let updatedArray;
    
    if( existingArray ) {
        updatedArray = JSON.parse(existingArray);
        updatedArray.push(obj);
    }
    else {
        updatedArray = [obj];
    }
    localStorage.setItem(key, JSON.stringify(updatedArray));
})

function checkEvent () {
    let td = tbody[0].querySelectorAll('td');
    let eventDay = 1;
    td.forEach(cell => {
        if(cell.classList.contains('nullDays') == false ) {
            for(let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                let value = localStorage.getItem(key);
                let d = key.split('/')[0];
                let m = key.split('/')[1];
                let y = key.split('/')[2];
                if( eventDay == d && m == month && year == y) {
                    let newDiv = document.createElement('div');
                    newDiv.className = 'event';
                    
                    let obj = JSON.parse(value);
                    obj.sort((a, b) => a.timing.localeCompare(b.timing));
                    console.log(obj);
                    
                    console.log(obj.length);
                    for(let k = 0; k < obj.length; k++) {
                        let p = document.createElement('p');
                        p.textContent = `${obj[k].timing} - ${obj[k].title}`;
                        let dayValue = cell.getAttribute('dayValue');
                        p.setAttribute('dayValue', dayValue);
                        newDiv.appendChild(p);
                    }
                    cell.appendChild(newDiv);
                }   
            }
        }
        eventDay++;
    });
}

function editEvent () {
    const eventP = document.getElementsByClassName('event');
    const eventArray = Array.from(eventP);
    
    eventArray.forEach(cell => {
        const p = cell.getElementsByTagName('p');
        const pArray = Array.from(p);
        pArray.forEach(eachP => {
            eachP.addEventListener('click', () => {
                event.stopPropagation();
                let myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
                let heading = document.getElementById('exampleModalLabel');
                let doc =  eachP.getAttribute('dayValue') + "/" + (month) + "/" + year;
                heading.textContent = 'Event on ' + doc;
                let value = localStorage.getItem(doc);
                let obj = JSON.parse(value);
                // obj.sort((a, b) => a.timing.localeCompare(b.timing));
                // console.log(obj);
                // console.log(eachP);
                
                let clickTime = eachP.textContent.split(' ')[0];
                console.log(clickTime);
                
                function findEventsByTiming(events, userTiming) {
                    let matchingEvents = events.filter(event => event.timing === userTiming);
                    return matchingEvents;
                }
                
                let result = findEventsByTiming(obj, clickTime);
                console.log(result[0].title);
                
                
                let inputTitle = document.getElementById('inputTitle')
                inputTitle.value = result[0].title;
                let inputDesc = document.getElementById('inputDesc');
                inputDesc.value = result[0].description;
                let inputTime = document.getElementById('inputTime');
                inputTime.value = result[0].timing;

                let indexToDelete = obj.indexOf(result);

                // Check if the element exists in the array
                if (indexToDelete > -1) {
                    obj.splice(indexToDelete, 1);
                }

                console.log(obj);
                
                
                // let newObj = {
                //     "title": inputTitle.value,
                //     "description": inputDesc.value,
                //     "timing": inputTime.value
                // }
                // let existingArray = localStorage.getItem(doc);
                // let updatedArray;
                
                // if( existingArray ) {
                //     updatedArray = JSON.parse(existingArray);
                //     updatedArray.push(newObj);
                // }
                // else {
                //     updatedArray = [obj];
                // }
                // localStorage.setItem(doc, JSON.stringify(updatedArray));
                myModal.show();
            })
        })
        
    })
}
