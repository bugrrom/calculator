"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
require("./style/style.css");
function Event(sender) {
    this._sender = sender;
    this._listeners = [];
}
Event.prototype = {
    attach: function (listener) {
        this._listeners.push(listener);
    },
    notify: function () {
        for (var index = 0; index < this._listeners.length; index += 1) {
            this._listeners[index](this._sender);
        }
    }
};
// state
function CalculatorModel() {
    var _chain = [];
    var _result = [0];
    var engMod = false;
    var programMod = false;
    var _this = this;
    var nowBin = null;
    _this.saveMod = function (mod) {
        if (mod === 'e') {
            engMod = !engMod;
            return engMod;
        }
        else {
            programMod = !programMod;
            return programMod;
        }
    };
    _this.saveEngMod = function () {
        engMod = !engMod;
        programMod = false;
        return engMod;
    };
    _this.saveProgramMod = function () {
        programMod = !programMod;
        engMod = false;
        return programMod;
    };
    _this.getChain = function () {
        return _chain;
    };
    _this.isChainEmpty = function () {
        return _chain.length === 0;
    };
    _this.emptyChain = function () {
        _chain = [];
        return _this;
    };
    _this.addToChain = function (value) {
        _chain.push(value);
    };
    _this.getResult = function () {
        return _result;
    };
    _this.emptyResult = function () {
        _result = [];
        return _this;
    };
    _this.addToResult = function (value) {
        _result.push(value);
        return _this;
    };
    _this.removeLastElementFromResult = function () {
        _result.pop();
    };
    _this.saveBin = function (value) {
        nowBin = value;
    };
}
//отображение
function CalculatorView(chainElement, resultElement, buttonsElements) {
    var _chainElement = chainElement;
    var _resultElement = resultElement;
    var _this = this;
    var createButtons = function (buttonsElements) {
        var newObj = {};
        var key = Object.keys(buttonsElements);
        key.forEach(function (el, index) { return newObj[el] = buttonsElements[el]; });
        return newObj;
    };
    var _buttons = createButtons(buttonsElements);
    var _maxChainLength = 28;
    var nameEventEl = [
        "EngClicked", "ceClicked", "cClicked", "backspaceClicked", "divisionClicked", "multiplicationClicked",
        "subtractionClicked", "additionClicked", "dotClicked", "equalsClicked", "num0Clicked", "num1Clicked",
        "num2Clicked", "num3Clicked", "num4Clicked", "num5Clicked", "num6Clicked", "num7Clicked",
        "num8Clicked", "num9Clicked", "sqrtClicked", "sqrt3Clicked", "sqrt4Clicked", "ExpClicked",
        "x2Clicked", "x3Clicked", "exClicked", "sinClicked", "cosClicked", "tanClicked", "asinClicked",
        "acosClicked", "atanClicked", "piClicked", "lnClicked", "log10Clicked", "factClicked", "ProgramClicked",
        "bit8Clicked", "bit4Clicked", "bit2Clicked", "bit1Clicked", "hexClicked", "decClicked", "octClicked",
        "binClicked", "AClicked", "BClicked", "CiClicked", "DClicked", "EClicked", "FClicked"
    ];
    _this.getEvent = function () {
        return nameEventEl;
    };
    //количество символов (низ)
    function _shortenNumber(number) {
        if (number < 0)
            return Number(number).toExponential(_this.getMaxResultDisplayLength() - 7);
        return Number(number).toExponential(_this.getMaxResultDisplayLength() - 6);
    }
    //количество символов (вверх)
    function _shortenChain(chain) {
        return ("&laquo; " +
            chain.join("").substr(chain.join("").length - _maxChainLength));
    }
    //test operator
    function _isItOperator(element) {
        return isNaN(element) && /[)(=/x+-]/.test(element);
    }
    //проверка длины
    function _isNumberTooLong(number) {
        return number.toString().length > _this.getMaxResultDisplayLength();
    }
    function _addSpaceToOperators(operator) {
        return " " + operator + " ";
    }
    function _addSpaceToChain(chain) {
        chain.forEach(function (element, index, array) {
            if (_isItOperator(element))
                array[index] = _addSpaceToOperators(element);
        });
    }
    function _isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function _shortenLongNumbers(chain) {
        chain.forEach(function (element, index, array) {
            if (_isNumber(element))
                if (_isNumberTooLong(element))
                    array[index] = _shortenNumber(element);
        });
    }
    function _renderResult(result) {
        _resultElement.innerHTML = result.join("");
        if (result.join("").length > _this.getMaxResultDisplayLength())
            _resultElement.innerHTML = _shortenNumber(result);
    }
    function _renderChain(chain) {
        _addSpaceToChain(chain);
        _shortenLongNumbers(chain);
        _chainElement.innerHTML = chain.join("");
        if (chain.join("").length > _maxChainLength)
            _chainElement.innerHTML = _shortenChain(chain);
    }
    // повесил обработчика событий
    function _attachListeners() {
        function createClick(arg, arg2) {
            return _buttons[arg].onclick = function () {
                _this.events[arg2].notify();
            };
        }
        function addFunClick() {
            Object.keys(buttonsElements).forEach(function (el) { createClick(el, el + "Clicked"); });
        }
        addFunClick();
    }
    function createEv(arg) {
        var newObj = {};
        arg.forEach(function (el) { return newObj[el] = new Event(_this); });
        return newObj;
    }
    function _checkBit() {
        var c = document.getElementsByName('bit');
        if (!c[3].checked)
            c[3].checked = true;
    }
    function _checkBin() {
        var c = document.getElementsByName('sis');
        if (!c[1].checked)
            c[1].checked = true;
    }
    _this.events = createEv(nameEventEl);
    _this.getMaxResultDisplayLength = function () {
        return 13;
    };
    _this.render = function (viewModel) {
        _renderResult(viewModel.result);
        _renderChain(viewModel.chain);
    };
    _this.getResult = function () {
        return _resultElement.innerHTML;
    };
    _this.getChain = function () {
        return _chainElement.innerHTML;
    };
    _this.disableButton = function (arg) {
        if (arg === 'bin') {
            _buttons.num2.disabled = true;
            _buttons.num3.disabled = true;
            _buttons.num4.disabled = true;
            _buttons.num5.disabled = true;
            _buttons.num6.disabled = true;
            _buttons.num7.disabled = true;
            _buttons.num8.disabled = true;
            _buttons.num9.disabled = true;
            _buttons.dot.disabled = true;
            _buttons.A.disabled = true;
            _buttons.B.disabled = true;
            _buttons.Ci.disabled = true;
            _buttons.D.disabled = true;
            _buttons.E.disabled = true;
            _buttons.F.disabled = true;
        }
        else if (arg === 'oct') {
            _buttons.num2.disabled = false;
            _buttons.num3.disabled = false;
            _buttons.num4.disabled = false;
            _buttons.num5.disabled = false;
            _buttons.num6.disabled = false;
            _buttons.num7.disabled = false;
            _buttons.num8.disabled = true;
            _buttons.num9.disabled = true;
            _buttons.dot.disabled = true;
            _buttons.A.disabled = true;
            _buttons.B.disabled = true;
            _buttons.Ci.disabled = true;
            _buttons.D.disabled = true;
            _buttons.E.disabled = true;
            _buttons.F.disabled = true;
        }
        else if (arg === 'dec') {
            _buttons.num2.disabled = false;
            _buttons.num3.disabled = false;
            _buttons.num4.disabled = false;
            _buttons.num5.disabled = false;
            _buttons.num6.disabled = false;
            _buttons.num7.disabled = false;
            _buttons.num8.disabled = false;
            _buttons.num9.disabled = false;
            _buttons.dot.disabled = true;
            _buttons.A.disabled = true;
            _buttons.B.disabled = true;
            _buttons.Ci.disabled = true;
            _buttons.D.disabled = true;
            _buttons.E.disabled = true;
            _buttons.F.disabled = true;
        }
        else if (arg === 'hex') {
            _buttons.num2.disabled = false;
            _buttons.num3.disabled = false;
            _buttons.num4.disabled = false;
            _buttons.num5.disabled = false;
            _buttons.num6.disabled = false;
            _buttons.num7.disabled = false;
            _buttons.num8.disabled = false;
            _buttons.num9.disabled = false;
            _buttons.dot.disabled = true;
            _buttons.A.disabled = false;
            _buttons.B.disabled = false;
            _buttons.Ci.disabled = false;
            _buttons.D.disabled = false;
            _buttons.E.disabled = false;
            _buttons.F.disabled = false;
        }
        else {
            _buttons.num2.disabled = false;
            _buttons.num3.disabled = false;
            _buttons.num4.disabled = false;
            _buttons.num5.disabled = false;
            _buttons.num6.disabled = false;
            _buttons.num7.disabled = false;
            _buttons.num8.disabled = false;
            _buttons.num9.disabled = false;
            _buttons.dot.disabled = false;
            _buttons.A.disabled = false;
            _buttons.B.disabled = false;
            _buttons.Ci.disabled = false;
            _buttons.D.disabled = false;
            _buttons.E.disabled = false;
            _buttons.F.disabled = false;
        }
    };
    _checkBit();
    _checkBin();
    _attachListeners();
}
//действия
function CalculatorController(model, view) {
    var _model = model;
    var _view = view;
    var _isResultCalculated = false;
    function _resultIsOperator() {
        var result = _model.getResult()[0];
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
    function _chainHasEqualSign() {
        return _model.getChain().includes("=");
    }
    function _getViewModel() {
        return {
            chain: _model.getChain().slice(),
            result: _model.getResult().slice()
        };
    }
    function _addOperator(operator) {
        if (_chainHasEqualSign()) {
            _model.emptyChain().addToChain(Number(_model.getResult().join("")));
        }
        else if (!_resultIsOperator())
            _model.addToChain(Number(_model.getResult().join("")));
        _model.emptyResult().addToResult(operator);
        _isResultCalculated = false;
        _view.render(_getViewModel());
    }
    function _addNumber(number) {
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
    function _gaussRound(num, decimalPlaces) {
        var d = decimalPlaces || 0, m = Math.pow(10, d), n = +(d ? num * m : num).toFixed(8), i = Math.floor(n), f = n - i, e = 1e-8, r = (f > 0.5 - e && f < 0.5 + e) ?
            ((i % 2 == 0) ? i : i + 1) : Math.round(n);
        return d ? r / m : r;
    }
    function _equals() {
        function calculateChain(chain) {
            for (var i = 0; i < chain.length; i++) {
                if (chain[i] === "x") {
                    chain[i - 1] = chain[i - 1] * chain[i + 1];
                    chain.splice(i, 2);
                    i--;
                }
                else if (chain[i] === "/") {
                    chain[i - 1] = chain[i - 1] / chain[i + 1];
                    chain.splice(i, 2);
                    i--;
                }
            }
            for (var i = 0; i < chain.length; i++) {
                if (chain[i] === "+") {
                    chain[i - 1] = chain[i - 1] + chain[i + 1];
                    chain.splice(i, 2);
                    i--;
                }
                else if (chain[i] === "-") {
                    chain[i - 1] = chain[i - 1] - chain[i + 1];
                    chain.splice(i, 2);
                    i--;
                }
            }
            return chain[0];
        }
        if (_chainHasEqualSign())
            return;
        if (_model.isChainEmpty())
            return;
        if (/[/x+-]/.test(_model.getChain()[_model.getChain().length - 1]) &&
            !_resultIsOperator())
            _model.addToChain(Number(_model.getResult().join("")));
        var chain = _model.getChain().slice();
        _model.addToChain("=");
        var result = calculateChain(chain);
        _model.emptyResult().addToResult(_gaussRound(result, 6));
        _model.addToChain(_gaussRound(result, 6));
        _saveToBack(_model.getChain());
        _view.render(_getViewModel());
        _isResultCalculated = true;
    }
    function _dot() {
        if (_isResultCalculated)
            _model.emptyResult().addToResult(0);
        else if (_resultIsOperator()) {
            _addOperator(_model.getResult().join(""));
            _addNumber(0);
        }
        _model.addToResult(".");
        _isResultCalculated = false;
        _view.render(_getViewModel());
    }
    function _geometry(TrigFunc) {
        var result = _model.getResult().join('');
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
                return atan(result);
        }
        function sin(arg) {
            /* _model.addToChain(`sin(${arg})`)*/
            var result = Math.sin(Number(arg)).toFixed(9);
            _model.emptyResult().addToResult(result);
            _saveToBack(["sin(" + arg + ")", '=', result]);
            _view.render(_getViewModel());
        }
        function cos(arg) {
            /*_model.addToChain(`cos(${arg})`)*/
            var result = Math.cos(Number(arg)).toFixed(9);
            _model.emptyResult().addToResult(result);
            _saveToBack(["cos(" + arg + ")", '=', result]);
            _view.render(_getViewModel());
        }
        function tan(arg) {
            /*_model.addToChain(`tan(${arg})`)*/
            var result = Math.tan(Number(arg)).toFixed(9);
            _model.emptyResult().addToResult(result);
            _saveToBack(["tan(" + arg + ")", '=', result]);
            _view.render(_getViewModel());
        }
        function asin(arg) {
            /*_model.addToChain(`asin(${arg})`)*/
            var result = Math.sinh(arg).toFixed(9);
            _model.emptyResult().addToResult(result);
            _saveToBack(["asin(" + arg + ")", '=', result]);
            _view.render(_getViewModel());
        }
        function acos(arg) {
            /*_model.addToChain(`acos(${arg})`)*/
            var result = Math.cosh(arg).toFixed(9);
            _model.emptyResult().addToResult(result);
            _saveToBack(["acos(" + arg + ")", '=', result]);
            _view.render(_getViewModel());
        }
        function atan(arg) {
            /*_model.addToChain(`atan(${arg})`)*/
            var result = Math.tanh(arg).toFixed(9);
            _model.emptyResult().addToResult(result);
            _saveToBack(["atan(" + arg + ")", '=', result]);
            _view.render(_getViewModel());
        }
    }
    function _mathOperation(operator) {
        var result = _model.getResult();
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
            case 'percent':
                return percent(result);
            case 'ln':
                return ln(result);
            case 'log10':
                return log10(result);
        }
        function sqrt(arg) {
            /* _model.addToChain(`sqrt(${arg})`)*/
            var result = Math.sqrt(arg).toFixed(9);
            _model.emptyResult().addToResult(result);
            _saveToBack(["sqrt(" + arg + ")", '=', result]);
            _view.render(_getViewModel());
        }
        function sqrt3(arg) {
            /*_model.addToChain(`sqrt3(${arg})`);*/
            var result = Math.cbrt(arg).toFixed(9);
            _model.emptyResult().addToResult(result);
            _saveToBack(["sqrt3(" + arg + ")", '=', result]);
            _view.render(_getViewModel());
        }
        function Exp() {
            var result = Math.E.toFixed(9);
            /*_model.addToChain(`E(${result})`)*/
            _addNumber(result);
        }
        function x2(arg) {
            /*_model.addToChain(`sqr(${arg})`)*/
            var result = Math.pow(arg, 2);
            _model.emptyResult().addToResult(result);
            _saveToBack(["x2(" + arg + ")", '=', result]);
            _view.render(_getViewModel());
        }
        function x3(arg) {
            /*_model.addToChain(`sqr(${arg})`)*/
            var result = Math.pow(arg, 3);
            _model.emptyResult().addToResult(result);
            _saveToBack(["sqr(" + arg + ")", '=', result]);
            _view.render(_getViewModel());
        }
        function ex(arg) {
            /*_model.addToChain(`exp(${arg})`)*/
            var result = Math.exp(arg);
            _model.emptyResult().addToResult(result);
            _saveToBack(["exp(" + arg + ")", '=', result]);
            _view.render(_getViewModel());
        }
        function pi() {
            var result = Math.PI.toFixed(9);
            /* _model.addToChain(`pi${result}`)*/
            _addNumber(result);
        }
        function factorial(arg) {
            /*_model.addToChain(`!${arg}`)*/
            if (arg == 0 || arg == 1) {
                _model.emptyResult().addToResult(1);
                _view.render(_getViewModel());
            }
            else {
                var fact = arg;
                for (var i = 1; i < arg; i++) {
                    fact *= i;
                }
                _model.emptyResult().addToResult(fact);
                _saveToBack(["!(" + arg + ")", '=', result]);
                _view.render(_getViewModel());
            }
        }
        function ln(arg) {
            /*_model.addToChain(`ln(${arg})`)*/
            var result = Math.log(arg);
            _model.emptyResult().addToResult(result);
            _saveToBack(["ln(" + arg + ")", '=', result]);
            _view.render(_getViewModel());
        }
        function log10(arg) {
            /*_model.addToChain(`log10(${arg})`)*/
            var result = Math.log10(arg);
            _model.emptyResult().addToResult(result);
            _saveToBack(["lon10(" + arg + ")", '=', result]);
            _view.render(_getViewModel());
        }
    }
    function _setEvents() {
        function createEvent(arg, funct, arg2) {
            if (arg2 === void 0) { arg2 = null; }
            return _view.events[arg].attach(function () {
                funct(arg2);
            });
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
            if (_model.getResult().length === 1)
                _model.emptyResult().addToResult(0);
            else
                _model.removeLastElementFromResult();
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
            if (_model.getResult().join("") === "0")
                return;
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
        createEvent("sqrt4Clicked", console.log, "sqrt4");
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
        createEvent("AClicked", console.log, "A");
        createEvent("BClicked", console.log, "B");
        createEvent("CiClicked", console.log, "C");
        createEvent("DClicked", console.log, "D");
        createEvent("EClicked", console.log, "E");
        createEvent("FClicked", console.log, "F");
    }
    function _saveToBack(arg) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fetch('', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8'
                                },
                                body: JSON.stringify(arg)
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function _saveMod(arg) {
        if (arg === 'e') {
            if (_model.saveMod('e')) {
                document.querySelector('.eng').style.display = 'block';
            }
            else {
                document.querySelector('.eng').style.display = 'none';
            }
        }
        else {
            if (_model.saveMod('p')) {
                document.querySelector('.prog').style.display = 'block';
                _saveBin('dec');
            }
            else {
                document.querySelector('.prog').style.display = 'none';
                _saveBin(null);
            }
        }
    }
    function _onKeyPress() {
        document.onkeypress = function (e) {
            e.preventDefault();
            if (/[+-/]/.test(e.key))
                _addOperator(e.key);
            if (e.key === '*')
                _addOperator('x');
            if (/[0-9]/.test(e.key))
                _addNumber(e.key);
            if (e.key === 'Enter')
                _equals();
        };
    }
    function _roughScale(x, base) {
        var parsed = parseInt(x, base);
        if (isNaN(parsed)) {
            return 0;
        }
        return parsed;
    }
    function _saveBin(arg) {
        var result = _model.getResult().join('');
        if (arg === 'bin') {
            _model.emptyChain();
            _model.addToChain((Number(result)).toString(2));
            _view.render(_getViewModel());
        }
        else if (arg === 'dec') {
            _model.emptyChain();
            _model.addToChain(_roughScale(result, 2));
            _view.render(_getViewModel());
        }
        else if (arg === 'hex') {
            _model.emptyChain();
            _model.addToChain((Number(result)).toString(16));
            _view.render(_getViewModel());
        }
        else if (arg === 'oct') {
            _model.emptyChain();
            _model.addToChain((Number(result)).toString(8));
            _view.render(_getViewModel());
        }
        _view.disableButton(arg);
    }
    _setEvents();
    _view.render(_getViewModel());
    _onKeyPress();
}
// доступ к DOM
document.addEventListener("DOMContentLoaded", function () {
    var btnId = [
        "Eng", "ce", "c", "backspace", "division", "num7", "num8", "num9", "multiplication", "num4",
        "num5", "num6", "subtraction", "num1", "num2", "num3", "addition", "num0",
        "dot", "equals", "sqrt", "sqrt3", "sqrt4", "Exp", "x2", "x3", "ex", "sin",
        "cos", "tan", "pi", "asin", "acos", "atan", "ln", "log10", "fact", "Program", "bit8", "bit4", "bit2", "bit1",
        "hex", "dec", "oct", "bin", "A", "B", "Ci", "D", "E", "F"
    ];
    var getButton = function (btnId) {
        var obj = {};
        btnId.forEach(function (el) { return obj[el] = document.getElementById(el); });
        return obj;
    };
    new CalculatorController(new CalculatorModel(), new CalculatorView(document.getElementById("chain"), document.getElementById("result"), getButton(btnId)));
});
