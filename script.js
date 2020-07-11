// HTML elements variables 

const days = document.getElementsByClassName("day");
const restartBtn = document.getElementById('restartBtn'); 
const addHabitInput = document.getElementById('addHabitInput');
const addInputBtn = document.getElementById('addInputBtn');
const tooltipTxt = document.getElementById('tooltipTxt');

// date variables 

const now = new Date();
const firstCo = localStorage.getItem('firstCo'); 

console.log('now : ' + now);
console.log('firstCo : ' + firstCo);

// user data array

let userInput = []; 

// function to check the difference between first connection & current date

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

function dateDiffInDays(a, b) {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

// function to highlight current date 

function highlightDate() {
    if (!firstCo) {
        localStorage.setItem('firstCo', now);
        days[0].classList.add('day-highlight');
    } else {
        const difference = dateDiffInDays(new Date(firstCo), now);
        console.log('difference is', difference)
        if (difference < 30) {
            days[difference].classList.add('day-highlight'); 
        } else {
            localStorage.clear();
            highlightDate(); 
        }
    }
}

// function to reload the page and empty local storage

function restartChallenge() {
    localStorage.clear();
    location.reload();
}

// function to add input from the form into a habit element

function addInput() {
    if (userInput.length > 3) {
        tooltipTxt.style.visibility = 'visible'; 
        setTimeout(function(){ tooltipTxt.style.visibility = 'hidden'; }, 4000);
    } else if (addHabitInput.value !== '') {
        userInput.unshift(addHabitInput.value); 
        renderHabit(); 
        localStorage.setItem('userInput', JSON.stringify(userInput));
    };
    addHabitInput.value = ''; 
}

// function to render the habit element on the page

function renderHabit() {
    let str = '';
    let arrayIcons = ['<i class="fas fa-cat"></i>', '<i class="fas fa-hippo"></i>', '<i class="fas fa-frog"></i>', '<i class="fas fa-dove"></i>'];
    for (let i=0; i < userInput.length; i++) {
        let habit = userInput[i];
        str += `<div class="user-habit">
                    <div class="checkbox">
                        <button class="remove-habit"><i class="fas fa-times"></i></button>
                        <button class="checkbtn button${i}">${arrayIcons[i]}</button>
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
}

// function to remove habit from display and local storage 

function deleteHabitData(element) {
    userInput.splice(element, 1); 
    localStorage.removeItem('userInput');
    localStorage.setItem('userInput', JSON.stringify(userInput));
    renderHabit(); 
}

// call functions and event listeners 

highlightDate(); 
loadInitialData(); 
restartBtn.addEventListener('click', restartChallenge); 
addInputBtn.addEventListener('click', addInput); 
