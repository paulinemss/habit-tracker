// HTML elements variables 

const days = document.getElementsByClassName('day');
const restartBtn = document.getElementById('restartBtn'); 
const addHabitInput = document.getElementById('addHabitInput');
const addInputBtn = document.getElementById('addInputBtn');
const tooltipTxt = document.getElementById('tooltipTxt');
const addHabitCalendar = document.getElementById('addHabitCalendar'); 
const colorHabitDivs = document.getElementsByClassName('colorHabit'); 

// date variables 

const now = new Date();
const firstCo = localStorage.getItem('firstCo'); 

console.log('now : ' + now);
console.log('firstCo : ' + firstCo);

// user data array and habit data object

let userInput = []; 
let habitInput = {}; 

// icons elements object

const iconElements = {
    cat: '<button class="checkbtn button0"><i class="fas fa-cat"></i></button>',
    hippo: '<button class="checkbtn button1"><i class="fas fa-hippo"></i></button>',
    frog: '<button class="checkbtn button2"><i class="fas fa-frog"></i></button>',
    dove: '<button class="checkbtn button3"><i class="fas fa-dove"></i></button>'
}

// function to check the difference between first connection & current date

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

function dateDiffInDays(a, b) {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

// function to reload the page and empty local storage

function restartChallenge() {
    localStorage.clear();
    location.reload();
}

// function to assign a color to the user input object 

function findNewColor() {
    const iconObjectNames = ['cat', 'hippo', 'frog', 'dove'];

    for (let i=0; i < userInput.length; i++) {
        for (let j=0; j < iconObjectNames.length; j++) {
            if (userInput[i].icon === iconObjectNames[j]) {
                iconObjectNames.splice(j, 1); 
            }
        }
    }

    return iconObjectNames[0];
}

// function to add input from the form into a habit element

function addInput() {
    if (userInput.length > 3) {
        tooltipTxt.style.visibility = 'visible'; 
        setTimeout(function(){ tooltipTxt.style.visibility = 'hidden'; }, 4000);
    } else if (addHabitInput.value !== '') {
        userInput.unshift({
            name: addHabitInput.value,
            icon: findNewColor()
        }); 
        renderHabit(); 
        highlightDate(); 
        localStorage.setItem('userInput', JSON.stringify(userInput));
    };

    addHabitInput.value = ''; 
}

// function to render the habit element on the page

function renderHabit() {
    let str = '';

    for (let i=0; i < userInput.length; i++) {
        let habit = userInput[i].name;
        let iconName = userInput[i].icon; 
        str += `<div class="user-habit">
                    <div class="checkbox">
                        <button class="remove-habit"><i class="fas fa-times"></i></button>
                        ${iconElements[iconName]}
                    </div>
                    <div class="habit-description">${habit}</div>
                </div>`; 
    }
    document.getElementById('habitsDiv').innerHTML = str;

    let btnsRemoveHabit = document.getElementsByClassName("remove-habit");
    for (let i=0; i < btnsRemoveHabit.length; i++) {
        btnsRemoveHabit[i].addEventListener('click', function() {
            deleteHabitData(i); 
        }); 
    }
}

// function to load initial data stored in local storage

function loadInitialData() {
    if (localStorage.getItem('userInput')) {
        userInput = JSON.parse(localStorage.getItem('userInput')); 
        renderHabit(); 
    };
    if (localStorage.getItem('habitInput')) {
        const loadedHabits = JSON.parse(localStorage.getItem('habitInput'));

        for (const property in loadedHabits) {
            for (let i=0; i < loadedHabits[property].length; i++) {
                habitAccomplished(loadedHabits[property][i], property); 
            }
        }
    }
}

// function to remove habit from display and local storage 

function deleteHabitData(element) {
    userInput.splice(element, 1); 
    localStorage.removeItem('userInput');
    localStorage.setItem('userInput', JSON.stringify(userInput));
    renderHabit(); 
    highlightDate(); 
}

// function to make the menu to add habit to calendar appear 

function habitToCalendar(element) {
    if (userInput.length === 0) {
        addHabitCalendar.style.display = 'none'; 
    } else {
        addHabitCalendar.style.display = 'block'; 
    }

    let str = []; 
    for (let i=0; i < userInput.length; i++) {
        let iconName = userInput[i].icon; 
        str.push(iconElements[iconName]);
    }
    str = str.join(' ');  

    if (days[element].classList.contains('day-highlight')) {
        addHabitCalendar.innerHTML = `select habit(s) you accomplished today: ${str}`; 
    } else {
        let actualDay = element + 1; 
        addHabitCalendar.innerHTML = `select habit(s) you accomplished on day ${actualDay}: ${str}`;
    }

    createHabitButton(element); 
}

for (let i=0; i < days.length; i++) {
    days[i].addEventListener('click', function() {
        habitToCalendar(i); 
    });  
}

// function to create buttons on habits above the calendar 

function createHabitButton(element) {
    const myButtons = document.getElementById('addHabitCalendar').getElementsByClassName('checkbtn'); 
    for (let i=0; i < myButtons.length; i++) {
        myButtons[i].classList.add('select-habit'); 
        myButtons[i].addEventListener('click', function() {
            habitAccomplished(i, element); 
        }); 
    }
}

// function to add accomplished habit to calendar

function habitAccomplished(indexHabit, indexDate) {
    colorHabitDivs[indexDate].innerHTML = '';  

    for (let i=0; i < userInput.length; i++) {
        let div = document.createElement('div'); 
        colorHabitDivs[indexDate].appendChild(div);
    }

    if (!habitInput[indexDate]) {
        habitInput[indexDate] = []; 
        habitInput[indexDate].unshift(indexHabit); 
    } else {
        habitInput[indexDate].unshift(indexHabit); 
    }

    localStorage.setItem('habitInput', JSON.stringify(habitInput));

    for (const property in habitInput) {
        colorDivInCalendar(property, habitInput[property]); 
    }
}

function colorDivInCalendar(indexDate, indexHabit) {
    console.log('trying to color div in calendar with arguments', indexDate, indexHabit);
    const divsToColor = colorHabitDivs[indexDate].getElementsByTagName("div"); 

    for (let i=0; i < divsToColor.length; i++) {
        divsToColor[i].classList.add('main-habit'); 
    }

    for (let j=0; j < indexHabit.length; j++) {
        if (userInput[indexHabit[j]].icon === 'dove') {
            divsToColor[indexHabit[j]].classList.add('orange-habit'); 
        } else if (userInput[indexHabit[j]].icon === 'frog') {
            divsToColor[indexHabit[j]].classList.add('green-habit'); 
        } else if (userInput[indexHabit[j]].icon === 'hippo') {
            divsToColor[indexHabit[j]].classList.add('pink-habit'); 
        } else if (userInput[indexHabit[j]].icon === 'cat') {
            divsToColor[indexHabit[j]].classList.add('blue-habit'); 
        }
    }    
}

// function to highlight current date 

function highlightDate() {
    if (!firstCo) {
        localStorage.setItem('firstCo', now);
        days[0].classList.add('day-highlight');
        habitToCalendar(0); 
    } else {
        const difference = dateDiffInDays(new Date(firstCo), now);
        console.log('difference is', difference)
        if (difference < 30) {
            days[difference].classList.add('day-highlight'); 
            habitToCalendar(difference); 
        } else {
            localStorage.clear();
            highlightDate(); 
        }
    }
}

// call functions and event listeners 

loadInitialData(); 
highlightDate(); 
restartBtn.addEventListener('click', restartChallenge); 
addInputBtn.addEventListener('click', addInput); 
