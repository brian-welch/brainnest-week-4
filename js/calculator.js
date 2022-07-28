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
const plusMinusButton    = document.querySelector('[data-value="plus-minus"]');
const saveMemoryButton   = document.querySelector('[data-value="mem-save"]');
const recallMemoryButton = document.querySelector('[data-value="mem-recall"]');
const unsaveMemoryButton = document.querySelector('[data-value="mem-unsave"]');

const calcButtons        = document.getElementsByClassName("calcButton");
const historyRoll        = document.getElementById("historyRoll");
const infoBox            = document.getElementById("functionInfo");
const calculatorOutput   = document.querySelector(".digit-row");
const exponentMessage    = document.getElementById("exponentMessage");
const memoryMessage      = document.getElementById("memoryMessage");

let result = '', placeHolder = '', memory = '', x = '', y = '', dotsAndZerosString = '';
let exp = false, executed = true, actionLogged = false, plusMinusSet = false, ignoreX = false;
let historyLine = document.createElement('li');

const setActionLogged = (value) => {
    value == 'execute' ? actionLogged = 'restart' : actionLogged = value;
}

const decimalHandler = (dataValue) => {
    return (dataValue == '.' && calculatorOutput.innerText.length == 0) ? '0' + dataValue : dataValue;
}

const dotsAndZerosStringCheck = (value) => {
    let temp = true;
    if (value === '.') {
        temp = dotsAndZerosString.split('').indexOf('.') > -1 ? false : true;
    } else if (value === '0') {
        temp = (dotsAndZerosString == '0') ? false : true;
    }
    return temp;
}

const resetCalculator = () => {
    calculatorOutput.innerText = '', result = '', x = '', y = '', result = '', placeHolder = '',
    exp = false, executed = true, actionLogged = false, ignoreX = false;
    historyLine = document.createElement('li'), dotsAndZerosString = '', console.clear();
    exponentMessage.classList.remove('opacity-one');
}

const trailingDecimalCheck = (output) => {
    return output[output.length-1] == '.' ? output.replace('.', '') : output;
}

const longOutputSantizer = (output) => {
    let temp = '';
    let exp = output < 0 ? output.toString().length-2 : output.toString().length-1;
    if (output.toString().indexOf('e') > -1) {
        let arr = output.toString().split('e');
        temp = (arr[0].substring(0, 14 - (2 + arr[1].length)) + 'e' + arr[1]);
    } else if (output.toString().length > 14 && output.toString().indexOf('e') == -1) {
        if (Math.abs(output) > 99999999999999) {
            temp = (output/Math.pow(10,exp)).toString().substring(0, 14 - (2 + exp.toString().length)) + 'e+' + exp;
        } else {
            temp = output.toString().substring(0, 14);
        }
    } else {
        temp = output.toString().substring(0, 14);
    }
    return trailingDecimalCheck(temp);
}

const calcRouter = (a, b, actionLogged, dataValue) => {
    switch(actionLogged) {
        case 'add':
            !parseFloat(a) && parseInt(a) != 0 ? a = 0 : a = parseFloat(a);
            !parseFloat(b) ? b = 0 : b = parseFloat(b);
            result = longOutputSantizer(add(a, b));
            setActionLogged(dataValue);
            break;
        case 'subtract':
            !parseFloat(a) && parseInt(a) != 0 ? a = 0 : a = parseFloat(a);
            !parseFloat(b) ? b = 0 : b = parseFloat(b);
            result = longOutputSantizer(subtract(a, b));
            setActionLogged(dataValue);
            break;
          case 'multiply':
            !parseFloat(a) && parseInt(a) != 0 ? a = 0 : a = parseFloat(a);
            !parseFloat(b) && b != '0' ? b = 1 : b = parseFloat(b);
            result = longOutputSantizer(multiply(a, b));
            setActionLogged(dataValue);
            break;
        case 'divide':
            !parseFloat(a) && parseInt(a) != 0 ? a = 0 : a = parseFloat(a);
            !parseFloat(b) && b != '0' ? b = 1 : b = parseFloat(b);
            result = isFinite(divide(a, b)) ? longOutputSantizer(divide(a, b)) : "IMPOSSIBLE";
            setActionLogged(dataValue);
            break;
        case 'exponent':
            !parseFloat(a) && parseInt(a) != 0 ? a = 0 : a = parseFloat(a);
            !parseFloat(b) ? b = 0 : b = parseFloat(b);
            result = isFinite(exponent(a, b)) ? longOutputSantizer(exponent(a, b)): "TOO DAMNED BIG";
            setActionLogged(dataValue);
            exponentMessage.classList.remove('opacity-one');
            break;
        case 'squareroot':
            !parseFloat(a) && parseInt(a) != 0 ? a = 0 : a = parseFloat(a);
            !parseFloat(b) ? b = 0 : b = parseFloat(b);
            result = isFinite(squareroot(a + b)) ? longOutputSantizer(squareroot(a + b)): "goofy";
            setActionLogged(dataValue);
            break;
        default:
            result = a;
            setActionLogged('execute');
            break;
      }
      x = result, y = '';
      return result;
}

const calculate = (event) => {
    let dataValue = event.currentTarget.dataset.value;
    let dataType = event.currentTarget.dataset.type;
    if (dataType == 'input' && dotsAndZerosStringCheck(dataValue)) {
        actionLogged == 'restart' ? (x = '', actionLogged = false) : null;
        !actionLogged ? (x += decimalHandler(dataValue)) : (y += dataValue);
    } else if (dataType == 'action') {
        historyLine.innerText += dotsAndZerosString;
        dotsAndZerosString = '';
        actionLogged == 'restart'? actionLogged = false : null;
        actionLogged ? calcRouter(x, y, actionLogged, dataValue) : actionLogged = dataValue;
    } else if (dataType == 'direct') {
        historyLine.innerText += dotsAndZerosString;
        dotsAndZerosString = '';
        placeHolder = calcRouter(x, y, actionLogged, dataValue);
        actionLogged = dataValue;
        calcRouter(x, y, actionLogged, 'execute');
    }
}

const addToOutput = (event) => {
    let dataValue = event.currentTarget.dataset.value;
    let dataType = event.currentTarget.dataset.type;
    if (dataType == 'input' && dotsAndZerosStringCheck(dataValue)) {
        executed ? (calculatorOutput.innerText = '', executed = false) : null;
        calculatorOutput.append(decimalHandler(dataValue));
        calculatorOutput.innerText = calculatorOutput.innerText.substring(0,14);
    } else if (dataType == 'action' || dataType == 'direct') {
        dataValue == 'execute' ? calculatorOutput.innerText = result : calculatorOutput.innerText = x;
        executed = true;
    }
}

const addToHistory = (event) => {
    let dataType = event.currentTarget.dataset.type;
    let dataValue = event.currentTarget.dataset.value;
    let dataIgnore = parseInt(event.currentTarget.dataset.historyIgnore);
    let dataSymbol = event.currentTarget.dataset.historySymbol;
    let histLine = historyLine.innerText, histLineLen = historyLine.innerText.length;

    if ((dataValue == 'execute' ||  dataValue == 'squareroot')&& historyLine != '') {
        if (dataValue == 'squareroot') {
            if (histLine.indexOf(' ') == -1){
                historyLine.innerText = '';
                historyLine.append(decimalHandler(dataSymbol) + dotsAndZerosString + placeHolder + ' = ' + result);
                historyRoll.append(historyLine);
                historyLine = document.createElement('li');
            } else {
                historyLine.append(" = " + placeHolder + "," + decimalHandler(dataSymbol) + dotsAndZerosString + placeHolder + ' = ' + result);
                historyRoll.append(historyLine);
                historyLine = document.createElement('li');
            }
        } else {
            historyLine.append(" = " + result);
            historyRoll.append(historyLine);
            historyLine = document.createElement('li');
        }
    }
    if (!dataIgnore && dotsAndZerosStringCheck(dataValue)) {
        dataType == 'action' && histLine.substring(histLineLen - 3, histLineLen) != dataSymbol ?    
            historyLine.append(dataSymbol) :
            null;
        dataType == "input" ?
            dotsAndZerosString += decimalHandler(dataSymbol) :
            null;
    }
    console.log(`result(${typeof result}): ${result}, x(${typeof x}): ${x}, y(${typeof y}): ${y}, actionLogged: ${actionLogged}, dotsAndZerosString: ${dotsAndZerosString}\n\n`);
}

// EVENT LISTENERS

infobutton.addEventListener('click', (event) => { infoBox.classList.toggle('info-toggle'); });
clearScreenButton.addEventListener('click', (event) => { resetCalculator(); });
clearHistoryButton.addEventListener('click', (event) => { historyRoll.innerText = ''; });
exponentButton.addEventListener('click', (event) => { exponentMessage.classList.add('opacity-one'); });
unsaveMemoryButton.addEventListener('click', (event) => { memoryMessage.classList.remove('opacity-one'), memory = ''; });

saveMemoryButton.addEventListener('click', (event) => {
    memoryMessage.classList.add('opacity-one');
    parseFloat(calculatorOutput.innerText) ?
        memory = calculatorOutput.innerText :
        memoryMessage.classList.remove('opacity-one');
});

recallMemoryButton.addEventListener('click', (event) => {
    actionLogged == 'restart' ? (x = '', actionLogged = false) : null;
    !actionLogged ? x += memory : y += memory;
    console.log(`x type: ${typeof x}, y type: ${typeof y}`);
    x = x.substring(0,14), y = y.substring(0,14);
    executed ? (calculatorOutput.innerText = '', executed = false) : null;
    calculatorOutput.append(memory);
    calculatorOutput.innerText = longOutputSantizer(calculatorOutput.innerText);
    historyLine.append(memory);
});

plusMinusButton.addEventListener('click', (event) => {
    if (!actionLogged && x.length == 0) {
        null;
    } else if (parseInt(x) && actionLogged && y.length == 0) {
        null;
    } else if (y.length > 0 && actionLogged) {
        y = (parseFloat(y) * (-1)).toString().substring(0,14);
        calculatorOutput.innerText = (y);
        dotsAndZerosString = dotsAndZerosString.slice(0,1) == '-' ? dotsAndZerosString.slice(1) : '-' + dotsAndZerosString;
    } else {
        (parseFloat(x) * (-1)) ? x = (parseFloat(x) * (-1)).toString().substring(0,14) : null;
        calculatorOutput.innerText = (x);
        dotsAndZerosString = dotsAndZerosString.slice(0,1) == '-' ? dotsAndZerosString.slice(1) : '-' + dotsAndZerosString;
    }
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