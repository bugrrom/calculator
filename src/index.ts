import "./style/style.css"

function Event(sender): void {
    this._sender = sender;
    this._listeners = [];
}

Event.prototype = {
    attach: function (listener: any): void {
        this._listeners.push(listener);
    },
    notify: function (): void {
        for (let index = 0; index < this._listeners.length; index += 1) {
            this._listeners[index](this._sender);
        }
    }
};

function CalculatorModel(): void {
    let _chain: Array<number|string> = [];
    let _result: Array<number> = [0];
    let engMod: boolean = false;
    let programMod: boolean = false;
    const _this = this;
    let nowBin = null;

    _this.saveMod = function (mod: string): boolean {
        if(mod === "e"){
            engMod = !engMod;
            return engMod
        }else{
            programMod = !programMod;
            return programMod
        }
    };

    _this.saveEngMod = function (): boolean {
        engMod = !engMod;
        programMod = false;
        return engMod
    };

    _this.saveProgramMod = function (): boolean{
        programMod = !programMod;
        engMod = false;
        return programMod
    };

    _this.getChain = function (): Array<number|string> {
        return _chain;
    };

    _this.isChainEmpty = function (): boolean {
        return _chain.length === 0;
    };

    _this.emptyChain = function (): object {
        _chain = [];
        return _this;
    };

    _this.addToChain = function (value: number|string): void {
        _chain.push(value);
    };

    _this.getResult = function (): Array<number> {
        return _result;
    };

    _this.emptyResult = function (): object {
        _result = [];
        return _this;
    };

    _this.addToResult = function (value: number): object {
        _result.push(value);
        return _this;
    };

    _this.removeLastElementFromResult = function (): void {
        _result.pop();
    };

    _this.saveBin = function (value: string): void {
        nowBin = value
    };

    _this.saveToBack = async function (arg: Array<number| string>) {
        try {
            await fetch('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(arg)

            })
        } catch (e) {
            console.log(e)
        }
    }
}

function CalculatorView(chainElement: HTMLElement, resultElement: HTMLElement, buttonsElements: object): void {
    let _chainElement = chainElement;
    let _resultElement = resultElement;
    const _this = this;
    const createButtons = (buttonsElements: object): object => {
        let newObj = {};
        let key = Object.keys(buttonsElements);
        key.forEach( (el, index) => newObj[el] = buttonsElements[el]);
        return newObj
    };
    const _buttons: any = createButtons(buttonsElements);
    const _maxChainLength: number = 28;
    const nameEventEl: Array<string> = [
        "EngClicked", "ceClicked", "cClicked", "backspaceClicked", "divisionClicked", "multiplicationClicked",
        "subtractionClicked", "additionClicked", "dotClicked", "equalsClicked", "num0Clicked", "num1Clicked",
        "num2Clicked", "num3Clicked", "num4Clicked", "num5Clicked", "num6Clicked", "num7Clicked",
        "num8Clicked", "num9Clicked", "sqrtClicked", "sqrt3Clicked", "ExpClicked",
        "x2Clicked", "x3Clicked", "exClicked", "sinClicked", "cosClicked", "tanClicked", "asinClicked",
        "acosClicked", "atanClicked", "piClicked", "lnClicked", "log10Clicked", "factClicked", "ProgramClicked",
        "bit8Clicked", "bit4Clicked", "bit2Clicked", "bit1Clicked", "hexClicked", "decClicked", "octClicked",
        "binClicked", "AClicked", "BClicked", "CiClicked", "DClicked", "EClicked", "FClicked"
    ];
    _this.getEvent = function(): Array<string> {
        return nameEventEl
    };
    //количество символов (низ)
    function _shortenNumber(number: number): string {
        if (number < 0)
            return Number(number).toExponential(
                _this.getMaxResultDisplayLength() - 7
            );
        return Number(number).toExponential(_this.getMaxResultDisplayLength() - 6);
    }
    //количество символов (вверх)
    function _shortenChain(chain: Array<string|number>): string {
        return (
            "&laquo; " +
            chain.join("").substr(chain.join("").length - _maxChainLength)
        );
    }
    //test operator
    function _isItOperator(element: any): boolean {
        return isNaN(element) && /[)(=/x+-]/.test(element);
    }
    //проверка длины
    function _isNumberTooLong(number: number): boolean {
        return number.toString().length > _this.getMaxResultDisplayLength();
    }

    function _addSpaceToOperators(operator: string): string {
        return " " + operator + " ";
    }

    function _addSpaceToChain(chain): void {
        chain.forEach(function (element, index, array) {
            if (_isItOperator(element)) array[index] = _addSpaceToOperators(element);
        });
    }

    function _isNumber(n: any) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function _shortenLongNumbers(chain): void {
        chain.forEach(function (element, index, array) {
            if (_isNumber(element))
                if (_isNumberTooLong(element)) array[index] = _shortenNumber(element);
        });
    }

    function _renderResult(result: Array<string|number> & number): void {
        _resultElement.innerHTML = result.join("");
        if (result.join("").length > _this.getMaxResultDisplayLength())
            _resultElement.innerHTML = _shortenNumber(result);
    }

    function _renderChain(chain: Array<string>): void {
        _addSpaceToChain(chain);
        _shortenLongNumbers(chain);
        _chainElement.innerHTML = chain.join("");
        if (chain.join("").length > _maxChainLength)
            _chainElement.innerHTML = _shortenChain(chain);
    }
    // повесил обработчика событий
    function _attachListeners(): void {
        function createClick (arg: string, arg2: string): any {
            return _buttons[arg].onclick = function () {
                _this.events[arg2].notify()
            };
        }
        function addFunClick () {
            Object.keys(buttonsElements).forEach( el => {createClick(el, `${el}Clicked`)})
        }
        addFunClick()
    }

    function createEv (arg: Array<string>): object {
        let newObj = {};
        arg.forEach( el => newObj[el] = new Event(_this));
        return newObj
    }

    function _checkBin(): void {
        let c: any = document.getElementsByName('sis');
        if (!c[1].checked) c[1].checked = true;
    }

    _this.events = createEv(nameEventEl);

    _this.getMaxResultDisplayLength = function (): number {
        return 13;
    };

    _this.render = function (viewModel: any): void {
        _renderResult(viewModel.result);
        _renderChain(viewModel.chain);
    };

    _this.getResult = function (): string {
        return _resultElement.innerHTML;
    };

    _this.getChain = function (): string {
        return _chainElement.innerHTML;
    };

    _this.disableButton = function (arg: string): void {
        if(arg === 'bin'){
            _buttons.num2.disabled= true;
            _buttons.num3.disabled= true;
            _buttons.num4.disabled= true;
            _buttons.num5.disabled= true;
            _buttons.num6.disabled= true;
            _buttons.num7.disabled= true;
            _buttons.num8.disabled= true;
            _buttons.num9.disabled= true;
            _buttons.dot.disabled= true;
            _buttons.A.disabled= true;
            _buttons.B.disabled= true;
            _buttons.Ci.disabled= true;
            _buttons.D.disabled= true;
            _buttons.E.disabled= true;
            _buttons.F.disabled= true
        }else if(arg === 'oct'){
            _buttons.num2.disabled= false;
            _buttons.num3.disabled= false;
            _buttons.num4.disabled= false;
            _buttons.num5.disabled= false;
            _buttons.num6.disabled= false;
            _buttons.num7.disabled= false;
            _buttons.num8.disabled= true;
            _buttons.num9.disabled= true;
            _buttons.dot.disabled= true;
            _buttons.A.disabled= true;
            _buttons.B.disabled= true;
            _buttons.Ci.disabled= true;
            _buttons.D.disabled= true;
            _buttons.E.disabled= true;
            _buttons.F.disabled= true
        }else if(arg === 'dec'){
            _buttons.num2.disabled= false;
            _buttons.num3.disabled= false;
            _buttons.num4.disabled= false;
            _buttons.num5.disabled= false;
            _buttons.num6.disabled= false;
            _buttons.num7.disabled= false;
            _buttons.num8.disabled= false;
            _buttons.num9.disabled= false;
            _buttons.dot.disabled= true;
            _buttons.A.disabled= true;
            _buttons.B.disabled= true;
            _buttons.Ci.disabled= true;
            _buttons.D.disabled= true;
            _buttons.E.disabled= true;
            _buttons.F.disabled= true
        }else if(arg === 'hex'){
            _buttons.num2.disabled= false;
            _buttons.num3.disabled= false;
            _buttons.num4.disabled= false;
            _buttons.num5.disabled= false;
            _buttons.num6.disabled= false;
            _buttons.num7.disabled= false;
            _buttons.num8.disabled= false;
            _buttons.num9.disabled= false;
            _buttons.dot.disabled= true;
            _buttons.A.disabled= false;
            _buttons.B.disabled= false;
            _buttons.Ci.disabled= false;
            _buttons.D.disabled= false;
            _buttons.E.disabled= false;
            _buttons.F.disabled= false
        }else{
            _buttons.num2.disabled= false;
            _buttons.num3.disabled= false;
            _buttons.num4.disabled= false;
            _buttons.num5.disabled= false;
            _buttons.num6.disabled= false;
            _buttons.num7.disabled= false;
            _buttons.num8.disabled= false;
            _buttons.num9.disabled= false;
            _buttons.dot.disabled= false;
            _buttons.A.disabled= false;
            _buttons.B.disabled= false;
            _buttons.Ci.disabled= false;
            _buttons.D.disabled= false;
            _buttons.E.disabled= false;
            _buttons.F.disabled= false
        }
    };

    _checkBin();
    _attachListeners();
}

function CalculatorController(model, view): void {
    const _model = model;
    const _view = view;
    let _isResultCalculated: boolean = false;

    function _resultIsOperator(): boolean {
        let result = _model.getResult()[0];
        switch (result) {
            case "/":
            case "x":
            case "-":
            case "+":
                return true;
            default:
                return false;
        }
    }

    function _chainHasEqualSign(): Array<number|string> {
        return _model.getChain().includes("=");
    }

    function _getViewModel(): object {
        return {
            chain: _model.getChain().slice(),
            result: _model.getResult().slice()
        };
    }

    function _addOperator(operator: string): void {
        if (_chainHasEqualSign()) {
            _model.emptyChain().addToChain(Number(_model.getResult().join("")));
        } else if (!_resultIsOperator())
            _model.addToChain(Number(_model.getResult().join("")));

        _model.emptyResult().addToResult(operator);
        _isResultCalculated = false;
        _view.render(_getViewModel());
    }

    function _addNumber(number: number): void {
        if (_model.getResult().join("") === "0" || _isResultCalculated)
            _model.emptyResult();
        if (_resultIsOperator()) {
            _model.addToChain(_model.getResult()[0]);
            _model.emptyResult();
        }

        _model.addToResult(number);
        _view.render(_getViewModel());
        _isResultCalculated = false;
    }

    function _gaussRound(num: number, decimalPlaces: number) {
        let d = decimalPlaces || 0,
            m = Math.pow(10, d),
            n = +(d ? num * m : num).toFixed(8),
            i = Math.floor(n), f = n - i,
            e = 1e-8,
            r = (f > 0.5 - e && f < 0.5 + e) ?
                ((i % 2 == 0) ? i : i + 1) : Math.round(n);
        return d ? r / m : r;
    }

    function _equals(): void {
        function calculateChain(chain) {
            for (let i = 0; i < chain.length; i++) {
                if (chain[i] === "x") {
                    chain[i - 1] = chain[i - 1] * chain[i + 1];
                    chain.splice(i, 2);
                    i--;
                } else if (chain[i] === "/") {
                    chain[i - 1] = chain[i - 1] / chain[i + 1];
                    chain.splice(i, 2);
                    i--;
                }
            }
            for (let i = 0; i < chain.length; i++) {
                if (chain[i] === "+") {
                    chain[i - 1] = chain[i - 1] + chain[i + 1];
                    chain.splice(i, 2);
                    i--;
                } else if (chain[i] === "-") {
                    chain[i - 1] = chain[i - 1] - chain[i + 1];
                    chain.splice(i, 2);
                    i--;
                }
            }
            return chain[0];
        }

        if (_chainHasEqualSign()) return;
        if (_model.isChainEmpty()) return;
        if (
            /[/x+-]/.test(_model.getChain()[_model.getChain().length - 1]) &&
            !_resultIsOperator()
        )
            _model.addToChain(Number(_model.getResult().join("")));

        let chain = _model.getChain().slice();
        _model.addToChain("=");
        let result = calculateChain(chain);
        _model.emptyResult().addToResult(_gaussRound(result, 6));
        _model.addToChain(_gaussRound(result, 6));
        _model.saveToBack(_model.getChain());
        _view.render(_getViewModel());
        _isResultCalculated = true;
    }

    function _dot(): void {
        if (_isResultCalculated) _model.emptyResult().addToResult(0);
        else if (_resultIsOperator()) {
            _addOperator(_model.getResult().join(""));
            _addNumber(0);
        }

        _model.addToResult(".");
        _isResultCalculated = false;
        _view.render(_getViewModel());
    }

    function _geometry(TrigFunc: string): void {
        let result = _model.getResult().join('');
        switch (TrigFunc) {
            case 'sin':
                return (sin(result));
            case 'cos':
                return cos(result);
            case 'tan':
                return tan(result);
            case 'asin':
                return asin(result);
            case 'acos':
                return acos(result);
            case 'atan':
                return atan(result)
        }
        function sin(arg) {
            /* _model.addToChain(`sin(${arg})`)*/
            let result = Math.sin(Number(arg)).toFixed(9);
            _model.emptyResult().addToResult(result);
            _model.saveToBack([`sin(${arg})`,'=', result]);
            _view.render(_getViewModel());
        }

        function cos(arg) {
            /*_model.addToChain(`cos(${arg})`)*/
            let result = Math.cos(Number(arg)).toFixed(9);
            _model.emptyResult().addToResult(result);
            _model.saveToBack([`cos(${arg})`,'=', result]);
            _view.render(_getViewModel());
        }

        function tan(arg) {
            /*_model.addToChain(`tan(${arg})`)*/
            let result = Math.tan(Number(arg)).toFixed(9);
            _model.emptyResult().addToResult(result);
            _model.saveToBack([`tan(${arg})`,'=', result]);
            _view.render(_getViewModel());
        }

        function asin(arg) {
            /*_model.addToChain(`asin(${arg})`)*/
            let result = Math.sinh(arg).toFixed(9);
            _model.emptyResult().addToResult(result);
            _model.saveToBack([`asin(${arg})`,'=', result]);
            _view.render(_getViewModel());
        }

        function acos(arg) {
            /*_model.addToChain(`acos(${arg})`)*/
            let result = Math.cosh(arg).toFixed(9);
            _model.emptyResult().addToResult(result);
            _model.saveToBack([`acos(${arg})`,'=', result]);
            _view.render(_getViewModel());
        }

        function atan(arg) {
            /*_model.addToChain(`atan(${arg})`)*/
            let result = Math.tanh(arg).toFixed(9);
            _model.emptyResult().addToResult(result);
            _model.saveToBack([`atan(${arg})`,'=', result]);
            _view.render(_getViewModel());
        }
    }

    function _mathOperation(operator: string): void {
        let result = _model.getResult().join('');
        switch (operator) {
            case 'sqrt':
                return sqrt(result);
            case 'sqrt3':
                return sqrt3(result);
            case 'Exp':
                return Exp();
            case 'x2':
                return x2(result);
            case 'x3':
                return x3(result);
            case 'ex':
                return ex(result);
            case 'pi':
                return pi();
            case 'fact':
                return factorial(result);
            case 'ln':
                return ln(result);
            case 'log10':
                return log10(result)
        }

        function sqrt(arg: number): void {
            /* _model.addToChain(`sqrt(${arg})`)*/
            let result = Math.sqrt(arg).toFixed(9);
            _model.emptyResult().addToResult(Number(result));
            _model.saveToBack([`sqrt(${arg})`,'=', result]);
            _view.render(_getViewModel());
        }

        function sqrt3(arg: number) {
            /*_model.addToChain(`sqrt3(${arg})`);*/
            let result: any = Math.cbrt(arg).toFixed(9);
            _model.emptyResult().addToResult(Number(result));
            _model.saveToBack([`sqrt3(${arg})`,'=', result]);
            _view.render(_getViewModel());
        }

        function Exp(): void {
            let result = Math.E.toFixed(9);
            /*_model.addToChain(`E(${result})`)*/
            _addNumber(Number(result));
        }

        function x2(arg: number): void {
            /*_model.addToChain(`sqr(${arg})`)*/
            let result = Math.pow(arg, 2);
            _model.emptyResult().addToResult(result);
            _model.saveToBack([`x2(${arg})`,'=', result]);
            _view.render(_getViewModel());
        }

        function x3(arg: number): void {
            /*_model.addToChain(`sqr(${arg})`)*/
            let result = Math.pow(arg, 3);
            _model.emptyResult().addToResult(result);
            _model.saveToBack([`sqr(${arg})`,'=', result]);
            _view.render(_getViewModel());
        }

        function ex(arg: number): void {
            /*_model.addToChain(`exp(${arg})`)*/
            let result = Math.exp(arg);
            _model.emptyResult().addToResult(result);
            _model.saveToBack([`exp(${arg})`,'=', result]);
            _view.render(_getViewModel());
        }

        function pi(): void {
            let result = Math.PI.toFixed(9);
            /* _model.addToChain(`pi${result}`)*/
            _addNumber(Number(result))
        }

        function factorial(arg: number): void {
            /*_model.addToChain(`!${arg}`)*/
            if (arg == 0 || arg == 1) {
                _model.emptyResult().addToResult(1);
                _view.render(_getViewModel());
            } else {
                let fact = arg;
                for (let i = 1; i < arg; i++) {
                    fact *= i;
                }
                _model.emptyResult().addToResult(fact);
                _model.saveToBack([`!(${arg})`,'=', result]);
                _view.render(_getViewModel());
            }
        }

        function ln (arg: number): void {
            /*_model.addToChain(`ln(${arg})`)*/
            let result = Math.log(arg);
            _model.emptyResult().addToResult(result);
            _model.saveToBack([`ln(${arg})`,'=', result]);
            _view.render(_getViewModel());
        }

        function log10 (arg: number): void {
            /*_model.addToChain(`log10(${arg})`)*/
            let result = Math.log10(arg);
            _model.emptyResult().addToResult(result);
            _model.saveToBack([`lon10(${arg})`,'=', result]);
            _view.render(_getViewModel());
        }

    }
    //event to button
    function _setEvents(): void {

        function createEvent (arg: string, funct: any, arg2?: string| number ): any {
            return _view.events[arg].attach(function () {
                funct(arg2)
            })
        }
        createEvent("EngClicked", _saveMod, "e");

        createEvent("ProgramClicked", _saveMod, "p");

        _view.events.ceClicked.attach(function () {
            _model.emptyResult().addToResult(0);
            _isResultCalculated = false;
            _view.render(_getViewModel());
        });
        _view.events.cClicked.attach(function () {
            _model
                .emptyChain()
                .emptyResult()
                .addToResult(0);
            _isResultCalculated = false;
            _view.render(_getViewModel());
        });
        _view.events.backspaceClicked.attach(function () {
            if (_model.getResult().length === 1) _model.emptyResult().addToResult(0);
            else _model.removeLastElementFromResult();
            _isResultCalculated = false;
            _view.render(_getViewModel());
        });
        createEvent("divisionClicked", _addOperator, "/");

        createEvent("multiplicationClicked", _addOperator, "x");

        createEvent("subtractionClicked", _addOperator, "-");

        createEvent("additionClicked", _addOperator, "+");

        createEvent("dotClicked", _dot);

        createEvent("equalsClicked", _equals);

        _view.events.num0Clicked.attach(function () {
            if (_model.getResult().join("") === "0") return;
            _addNumber(0);
        });

        createEvent("num1Clicked", _addNumber, 1);

        createEvent("num2Clicked", _addNumber, 2);

        createEvent("num3Clicked", _addNumber, 3);

        createEvent("num4Clicked", _addNumber, 4);

        createEvent("num5Clicked", _addNumber, 5);

        createEvent("num6Clicked", _addNumber, 6);

        createEvent("num7Clicked", _addNumber, 7);

        createEvent("num8Clicked", _addNumber, 8);

        createEvent("num9Clicked", _addNumber, 9);

        createEvent("sqrtClicked", _mathOperation, "sqrt");

        createEvent("sqrt3Clicked", _mathOperation, "sqrt3");

        createEvent("ExpClicked", _mathOperation, "Exp");

        createEvent("x2Clicked", _mathOperation, "x2");

        createEvent("x3Clicked", _mathOperation, "x3");

        createEvent("exClicked", _mathOperation, "ex");

        createEvent("sinClicked", _geometry, "sin");

        createEvent("cosClicked", _geometry, "cos");

        createEvent("tanClicked", _geometry, "tan");

        createEvent("piClicked", _mathOperation, "pi");

        createEvent("asinClicked", _geometry, "asin");

        createEvent("acosClicked", _geometry, "acos");

        createEvent("atanClicked", _geometry, "atan");

        createEvent("lnClicked", _mathOperation, "ln");

        createEvent("log10Clicked", _mathOperation, "log10");

        createEvent("factClicked", _mathOperation, "fact");

        createEvent("hexClicked", _saveBin, "hex");

        createEvent("decClicked", _saveBin, "dec");

        createEvent("octClicked", _saveBin, "oct");

        createEvent("binClicked", _saveBin, "bin");

        createEvent("AClicked", console.log , "A");

        createEvent("BClicked", console.log , "B");

        createEvent("CiClicked", console.log , "C");

        createEvent("DClicked", console.log , "D");

        createEvent("EClicked", console.log , "E");

        createEvent("FClicked", console.log , "F")
    }

    function _saveMod(arg: string): void {
        if(arg === 'e'){
            let eng: any = document.querySelector('.eng');
            if(_model.saveMod('e')){
                eng.style.display = 'block'
            }else{
                eng.style.display = 'none'
            }
        }else{
            let programs: any = document.querySelector('.prog');
            if(_model.saveMod('p')){
                programs.style.display = 'block';
                _saveBin('dec')
            }else{
                _model.emptyChain();
                _view.render(_getViewModel());
                programs.style.display = 'none';
                _saveBin(null)
            }
        }

    }

    function _onKeyPress(): void {
        document.onkeypress = function (e) {
            e.preventDefault();
            if (/[+-/]/.test(e.key)) _addOperator(e.key);
            if (e.key === '*') _addOperator('x');
            if (/[0-9]/.test(e.key)) _addNumber(Number(e.key));
            if (e.key === "Enter") _equals()
        }
    }

    function _roughScale(x: string, base: number): number {
        const parsed = parseInt(x, base);
        if (isNaN(parsed)) { return 0 }
        return parsed
    }

    function _saveBin(arg: string): void {
        let result = _model.getResult().join('');
        if(arg === 'bin'){
            _model.emptyChain();
            _model.addToChain((Number(result)).toString(2));
            _view.render(_getViewModel());
        }else if(arg === 'dec'){
            _model.emptyChain();
            _model.addToChain(_roughScale(result, 2));
            _view.render(_getViewModel());
        }else if(arg === 'hex'){
            _model.emptyChain();
            _model.addToChain((Number(result)).toString(16));
            _view.render(_getViewModel());
        }else if(arg === 'oct'){
            _model.emptyChain();
            _model.addToChain((Number(result)).toString(8));
            _view.render(_getViewModel());
        }
        _view.disableButton(arg)
    }

    _setEvents();
    _view.render(_getViewModel());
    _onKeyPress();
}

// доступ к DOM
document.addEventListener("DOMContentLoaded", function (): void {
    const btnId=[
        "Eng", "ce", "c", "backspace", "division", "num7", "num8", "num9","multiplication", "num4",
        "num5", "num6", "subtraction", "num1", "num2", "num3", "addition", "num0",
        "dot", "equals", "sqrt", "sqrt3", "Exp", "x2", "x3", "ex", "sin",
        "cos", "tan", "pi", "asin", "acos", "atan", "ln", "log10", "fact", "Program", "bit8", "bit4", "bit2", "bit1",
        "hex", "dec", "oct", "bin", "A", "B", "Ci", "D", "E", "F"
    ];

    let getButton = function (btnId: Array<string>): object {
        let obj = {};
        btnId.forEach(el => obj[el] = document.getElementById(el));
        return obj
    };
    new CalculatorController(
        new CalculatorModel(),
        new CalculatorView(
            document.getElementById("chain"),
            document.getElementById("result"),
            getButton(btnId)
        )
    );
});
