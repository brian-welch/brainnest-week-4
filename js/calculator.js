const add = (x, y) => x + y;
const subtract = (x, y) => x - y;
const multiply = (x, y) => x * y;
const divide = (x, y) => x / y;
const percent = (x) => x * 100;
const sqroot = (x) => Math.sqrt(x);
const exponent = (x, y) => x ** y;

const calcButtons = document.getElementsByClassName("calcButton");
const calcButtons02 = document.querySelectorAll(".calcButton");
const historyRoll = document.getElementById("historyRoll");
const infobutton = document.getElementById("infoButton");
const infoBox = document.getElementById("functionInfo");
const clearScreenButton = document.querySelector('[data-value="clear"]');
const clearHistoryButton = document.querySelector('[data-value="clear-history"]');
const calculatorOutput = document.querySelector(".digit-row");

const reference = {
}

let result = '', memory = '', exp = false, sqrt = false;
let activeHistoryLine = 0, x, y;
let historyLine = document.createElement('li');

const addToHistory = (event) => {
    let dataType = event.target.offsetParent.dataset.type;
    let dataValue = event.target.offsetParent.dataset.value;
    let dataIgnore = parseInt(event.target.offsetParent.dataset.historyIgnore);
    let dataSymbol = event.target.offsetParent.dataset.historySymbol;

    if (dataValue == 'execute' && historyLine != '') {
        historyLine.append(" = " + result);
        historyRoll.append(historyLine);
        historyLine = document.createElement('li');
        // activeHistoryLine = 0;
    }
    if (!dataIgnore) {
        // historyRoll.innerHTML += historyRoll.innerHTML.substr(0, 4) == '<li>' ? datasymbol : '<li>' + datasymbol;
        historyLine.append(dataSymbol);
        // activeHistoryLine = 1;
    }
}





// EVENT LISTENERS



infobutton.addEventListener('click', (event) => { infoBox.classList.toggle('info-toggle'); });
clearScreenButton.addEventListener('click', (event) => { calculatorOutput.innerHTML = '<span class="decimal">.</span>'; });
clearHistoryButton.addEventListener('click', (event) => { historyRoll.innerHTML = ''; });

for (let i = 0; i < calcButtons.length; i++) {
    calcButtons02[i].addEventListener('click', (event) => {
        console.log(event);
        console.log(event.target);
        console.log(event.target.offsetParent);
        console.log(event.target.offsetParent.dataset); // for data attributes
        addToHistory(event);
    });

    // calcButtons[i].addEventListener('click', (event) => {
    //     console.log(event);
    //     console.log(event.target);
    //     console.log(event.path[1].dataset);
    //     console.log(event.target.offsetParent.dataset); // for data attributes
    //     addToHistory(event);
    // });
}



window.onload = (event) => {
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let date = new Date();
    document.querySelector("#footerDisclaimer > span").append(date.toLocaleDateString('en-SE', options));
}