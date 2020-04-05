import CalculatorModel from "./CalculatorModel";
import {CalculatorSimpleView} from "./CalculatorView";


export default class CalculatorController {
    isResultCalculated: boolean = false;
    result: number;

    constructor(private model: CalculatorModel, private view: CalculatorSimpleView,) {

        this.onKeyPress();
        view.render(this.getViewModel());

        this.view.modeChangedEvent.attach(() => {
            this.setEvents();
        });
        this.setEvents();
    }

    resultIsOperator = (): boolean => {
        let result = this.model.getResult()[0];
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

    chainHasEqualSign = (): boolean => {
        return this.model.getChain().includes("=");
    }

    getViewModel = (): object => {
        return {
            chain: this.model.getChain().slice(),
            result: this.model.getResult().slice()
        };
    };

    addOperator = (operator: string): void => {
        let operators = null;
        switch (operator) {
            case "multiplication":
                operators = "x";
                break;
            case "subtraction":
                operators = "-";
                break;
            case "addition":
                operators = "+";
                break;
            case "division":
                operators = "/";
                break;
            default:
                operators = operator
        }
        if (this.chainHasEqualSign()) {
            this.model.emptyChain().addToChain(Number(this.model.getResult().join("")));
        } else if (!this.resultIsOperator())
            this.model.addToChain(Number(this.model.getResult().join("")));

        this.model.emptyResult().addToResult(operators);
        this.isResultCalculated = false;
        this.view.render(this.getViewModel());
    }

    addNumber = (number: string | number): void => {
        if (this.model.getResult().join("") === "0" || this.isResultCalculated)
            this.model.emptyResult();
        if (this.resultIsOperator()) {
            this.model.addToChain(this.model.getResult()[0]);
            this.model.emptyResult();
        }
        this.model.addToResult(number);
        this.view.render(this.getViewModel());
        this.isResultCalculated = false;
    }
    //rounding
    gaussRound = (num: number, decimalPlaces: number): number => {
        let d = decimalPlaces || 0,
            m = Math.pow(10, d),
            n = +(d ? num * m : num).toFixed(8),
            i = Math.floor(n), f = n - i,
            e = 1e-8,
            r = (f > 0.5 - e && f < 0.5 + e) ?
                ((i % 2 == 0) ? i : i + 1) : Math.round(n);
        return d ? r / m : r;
    }

    calculateChain = (chain: Array<any>): number => {
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

    equals = (): void => {
        if (this.chainHasEqualSign()) return;
        if (this.model.isChainEmpty()) return;
        if (
            /[/x+-]/.test(this.model.getChain()[this.model.getChain().length - 1]) &&
            !this.resultIsOperator()
        )
            this.model.addToChain(Number(this.model.getResult().join("")));

        let chain = this.model.getChain().slice();
        this.model.addToChain("=");
        let result = this.calculateChain(chain);
        this.model.emptyResult().addToResult(this.gaussRound(result, 6));
        this.model.addToChain(this.gaussRound(result, 6));
        this.model.saveToBack(this.model.getChain());
        this.view.render(this.getViewModel());
        this.isResultCalculated = true;
    }

    dot = (): void => {
        if (this.isResultCalculated) this.model.emptyResult().addToResult(0);
        else if (this.resultIsOperator()) {
            this.addOperator(this.model.getResult().join(""));
            this.addNumber(0);
        }
        this.model.addToResult(".");
        this.isResultCalculated = false;
        this.view.render(this.getViewModel());
    }

    subscribeToEvent = (arg: string, funct: any, arg2?: string | number) => {
        return this.view.subscribe(arg + "Clicked", () => {
            funct(arg2)
        })
    }

    calculateMathOperation = (arg: string): void => {
        this.model.mathOperation(arg)
        this.view.render(this.getViewModel())
    }

    calculateGeometry = (arg: string): void => {
        this.model.geometry(arg)
        this.view.render(this.getViewModel())
    }

    setEvents = (): void => {

        this.view.subscribe("ceClicked", () => {
            this.model.emptyResult().addToResult(0);
            this.isResultCalculated = false;
            this.view.render(this.getViewModel());
        });
        this.view.subscribe("cClicked", () => {
            this.model
                .emptyChain()
                .emptyResult()
                .addToResult(0);
            this.isResultCalculated = false;
            this.view.render(this.getViewModel());
        });
        this.view.subscribe("backspaceClicked", () => {
            if (this.model.getResult().length === 1) this.model.emptyResult().addToResult(0);
            else this.model.removeLastElementFromResult();
            this.isResultCalculated = false;
            this.view.render(this.getViewModel());
        });

        this.subscribeToEvent("dot", this.dot);

        this.subscribeToEvent("equals", this.equals);

        this.view.subscribe("num0Clicked", () => {
            if (this.model.getResult().join("") === "0") return;
            this.addNumber(0);
        });


        [...new Array(9)].forEach((el, i) => this.subscribeToEvent(`num${i + 1}`, this.addNumber, i + 1))
        let operations = {
            math: {
                method: this.calculateMathOperation,
                commands: ["sqrt", "sqrt3", "exp", "x2", "x3", "ex", "pi", "ln", "log10", "fact"]
            },
            geometr: {
                method: this.calculateGeometry,
                commands: ["sin", "cos", "tan", "asin", "acos", "atan"]
            },
            bin: {
                method: this.saveBin,
                commands: ["hex", "dec", "oct", "bin"]
            },
            operator: {
                method: this.addOperator.bind(this),
                commands: ["multiplication", "subtraction", "addition", "division"]
            }
        };

        Object.keys(operations).forEach(key => {
            let operation = operations[key];
            operation.commands.forEach(c => {
                this.subscribeToEvent(c, operation.method.bind(this), c);
            })
        })

    }

    roughScale = (x: string, base: number): number => {
        const parsed = parseInt(x, base);
        if (isNaN(parsed)) {
            return 0
        }
        return parsed
    };

    saveBin = (arg: string = "dec"): void => {
        let result = this.model.getResult().join('');

        this.model.emptyChain();
        if (arg === "bin") {
            this.model.addToChain((Number(result)).toString(2));
        } else if (arg === "dec") {
            this.model.addToChain(this.roughScale(result, 2));
        } else if (arg === "hex") {
            this.model.addToChain((Number(result)).toString(16));
        } else if (arg === "oct") {
            this.model.addToChain((Number(result)).toString(8));
        }

        this.view.render(this.getViewModel());

        this.view.disableButton(arg)
    };

    onKeyPress = (): void => {
        document.onkeypress = (e) => {
            e.preventDefault();
            if (/[/+-]/.test(e.key)) this.addOperator(e.key);
            if (e.key === '*') this.addOperator("x");
            if (/[0-9]/.test(e.key)) this.addNumber(Number(e.key));
            if (e.key === "Enter") this.equals();
            if (e.key === ".") this.dot()
        }
    }
}
