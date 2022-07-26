const add        = (x, y) => x + y;
const subtract   = (x, y) => x - y;
const multiply   = (x, y) => x * y;
const divide     = (x, y) => x / y;
const exponent   = (x, y) => x ** y;
const squareroot = (x) => Math.sqrt(x);

const infobutton         = document.getElementById("infoButton");
const clearScreenButton  = document.querySelector('[data-value="clear"]');
const clearHistoryButton = document.querySelector('[data-value="clear-history"]');
const exponentButton     = document.querySelector('[data-value="exponent"]');
const sqrtButton         = document.querySelector('[data-value="squareroot"]');
const plusMinusButton    = document.querySelector('[data-value="plus-minus"]');
const saveMemoryButton   = document.querySelector('[data-value="mem-save"]');
const recallMemoryButton = document.querySelector('[data-value="mem-recall"]');
const unsaveMemoryButton = document.querySelector('[data-value="mem-unsave"]');

const calcButtons        = document.getElementsByClassName("calcButton");
const historyRoll        = document.getElementById("historyRoll");
const infoBox            = document.getElementById("functionInfo");
const calculatorOutput   = document.querySelector(".digit-row");
const exponentMessage    = document.getElementById("exponentMessage");
const sqrtMessage        = document.getElementById("sqrtMessage");
const memoryMessage      = document.getElementById("memoryMessage");

let result = '', memory = 0, activeHistoryLine = 0, decimalEntered = 0, x = '', y = '';
let exp = false, sqrt = false, executed = true, actionLogged = false, newStart = true, plusMinusSet = false;
let historyLine = document.createElement('li');

const setActionLogged = (value) => {
    value == 'execute' ? actionLogged = 'restart' : actionLogged = value;
}

const decimalHandler = (dataValue) => {
    return (dataValue == '.' && calculatorOutput.length == 0) ? '0' + dataValue : dataValue;
}

const resetCalculator = () => {
    calculatorOutput.innerText = '', result = '', x = '', y = '',
    result = '', activeHistoryLine = 0, decimalEntered = 0,
    x = '', y = '', exp = false, sqrt = false, executed = true, actionLogged = false;
    historyLine = document.createElement('li'), console.clear();
}

const calcRouter = (a, b, actionLogged, dataValue) => {
    switch(actionLogged) {
        case 'add':
            !parseFloat(b) ? (a = parseFloat(a), b = 0) : (a = parseFloat(a), b = parseFloat(b));
            result = add(a, b).toString().substring(0,14);
            setActionLogged(dataValue);
            break;
        case 'subtract':
            !parseFloat(b) ? (a = parseFloat(a), b = 0) : (a = parseFloat(a), b = parseFloat(b));
            result = subtract(a, b).toString().substring(0,14);
            setActionLogged(dataValue);
            break;
          case 'multiply':
            !parseFloat(b) ? (a = parseFloat(a), b = 1) : (a = parseFloat(a), b = parseFloat(b));
            result = multiply(a, b).toString().substring(0,14);
            setActionLogged(dataValue);
            break;
        case 'divide':
            !parseFloat(b) ? (a = parseFloat(a), b = 0) : (a = parseFloat(a), b = parseFloat(b));
            result = divide(a, b) ? divide(a, b).toString().substring(0,14) : "ERROR";
            setActionLogged(dataValue);
            break;
        case 'exponent':
            !parseFloat(b) ? (a = parseFloat(a), b = 1) : (a = parseFloat(a), b = parseFloat(b));
            result = exponent(a, b).toString().substring(0,14);
            setActionLogged(dataValue);
            exponentMessage.classList.remove('opacity-one');
            break;
        case 'squareroot':
            let num = b.length == 0 ? parseFloat(a) : parseFloat(b);
            result = squareroot(num).toString().substring(0,14);
            setActionLogged(dataValue);
            historyLine.innerText = '';
            historyLine.append(" √" + a + " = " + result);
            historyRoll.append(historyLine);
            historyLine = document.createElement('li');
            calculatorOutput.innerText = result.substring(0,14);
            break;
        default:
            result = a;
            setActionLogged('execute');
            break;
      }
      x = result, y = '';
}

const calculate = (event) => {
    let dataValue = event.currentTarget.dataset.value;
    let dataType = event.currentTarget.dataset.type;
    if (dataType == 'input') {
        actionLogged == 'restart' ? (x = '', actionLogged = false) : null;
        !actionLogged ? x += dataValue : y += dataValue;
        x = x.substring(0,14), y = y.substring(0,14);
    } else if (dataType == 'action') {
        actionLogged == 'restart' ? actionLogged = false : null;
        actionLogged ? calcRouter(x, y, actionLogged, dataValue) : actionLogged = dataValue;
    } else if (dataType == 'direct') {
        // actionLogged ? calcRouter(x, y, actionLogged, dataValue) : actionLogged = dataValue;
        calcRouter(x, y, dataValue, 'execute');
    } 
}

const addToOutput = (event) => {
    let dataValue = event.currentTarget.dataset.value;
    let dataType = event.currentTarget.dataset.type;
    if (dataType == 'input') {
        executed ? (calculatorOutput.innerText = '', executed = false) : null;
        calculatorOutput.append(decimalHandler(dataValue));
        calculatorOutput.innerText = calculatorOutput.innerText.substring(0,14);
    } else if (dataType == 'action') {
        result ? calculatorOutput.innerText = result : null;
        executed = true;
    }
}


const addToHistory = (event) => {
    let dataValue = event.currentTarget.dataset.value;
    let dataIgnore = parseInt(event.currentTarget.dataset.historyIgnore);
    let dataSymbol = event.currentTarget.dataset.historySymbol;

    if (dataValue == 'execute' && historyLine != '') {
        historyLine.append(" = " + result);
        historyRoll.append(historyLine);
        historyLine = document.createElement('li');
    }
    if (!dataIgnore) {
        historyLine.append(dataSymbol);
    }
    console.log(`result: ${result}, x: ${x}, y: ${y}, actionLogged: ${actionLogged}, plusMinusSet: ${plusMinusSet}`);
}

// EVENT LISTENERS

infobutton.addEventListener('click', (event) => { infoBox.classList.toggle('info-toggle'); });
clearScreenButton.addEventListener('click', (event) => { resetCalculator(); });
clearHistoryButton.addEventListener('click', (event) => { historyRoll.innerText = ''; });
exponentButton.addEventListener('click', (event) => { exponentMessage.classList.add('opacity-one'); });
saveMemoryButton.addEventListener('click', (event) => {
    memoryMessage.classList.add('opacity-one'), memory = calculatorOutput.innerText;
});
unsaveMemoryButton.addEventListener('click', (event) => {
    memoryMessage.classList.remove('opacity-one'), memory = '';
});
recallMemoryButton.addEventListener('click', (event) => {
    actionLogged == 'restart' ? (x = '', actionLogged = false) : null;
    !actionLogged ? x += memory : y += memory;
    x = x.substring(0,14), y = y.substring(0,14);
    executed ? (calculatorOutput.innerText = '', executed = false) : null;
    calculatorOutput.append(memory);
    calculatorOutput.innerText = calculatorOutput.innerText.substring(0,14);
    historyLine.append(memory);
    console.log(`result: ${result}, x: ${x}, y: ${y}, actionLogged: ${actionLogged}, plusMinusSet: ${plusMinusSet}`);
});
plusMinusButton.addEventListener('click', (event) => {
    if (y.length > 0) {
        y = (parseFloat(y) * (-1)).toString().substring(0,14);
        calculatorOutput.innerText[0] == '-' ?
            calculatorOutput.innerText = calculatorOutput.innerText.slice(1).substring(0,14) :
            calculatorOutput.innerText = ('-' + calculatorOutput.innerText).substring(0,14);
    } else {
        (parseFloat(x) * (-1)) ? x = (parseFloat(x) * (-1)).toString().substring(0,14) : x = '-' + x;
        calculatorOutput.innerText[0] == '-' ?
            calculatorOutput.innerText = calculatorOutput.innerText.slice(1).substring(0,14) :
            calculatorOutput.innerText = ('-' + calculatorOutput.innerText).substring(0,14);
    }
    let temp = historyLine.innerText;
    historyLine.innerText = temp.substring(0,temp.length-1) + '-' + temp[-1,temp.length-1];;
});

for (let i = 0; i < calcButtons.length; i++) {
    calcButtons[i].addEventListener('click', (event) => {
        calculate(event);
        addToOutput(event);
        addToHistory(event);
    });
}

window.onload = (event) => {
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let date = new Date();
    document.querySelector("#footerDisclaimer > span").append(date.toLocaleDateString('en-SE', options));
}