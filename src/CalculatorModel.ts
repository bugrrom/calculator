import {save} from "./api";


export default class CalculatorModel {
    chain: Array<number | string> = [];
    result: Array<number | string> = [0];

    constructor() {
    }

    getChain = (): Array<any> => {
        return this.chain
    };

    getResult = (): Array<number | string> => {
        return this.result
    };

    isChainEmpty = (): boolean => {
        return this.chain.length === 0
    };

    emptyChain = (): any => {
        this.chain = [];
        return this
    };

    emptyResult = (): any => {
        this.result = [];
        return this;
    };

    addToChain = (value: string | number): void => {
        this.chain.push(value)
    }

    addToResult = (value: number | string): object => {
        this.result.push(value);
        return this;
    };

    removeLastElementFromResult = (): void => {
        this.result.pop();
    };

    saveToBack = (arg: Array<any>): void => {
        save(arg)
    };

    mathOperation = (operationName: string): void => {
        let result = +this.getResult().join('');
        switch (operationName) {
            case "sqrt":
                return this.sqrt(result);
            case "sqrt3":
                return this.sqrt3(result);
            case "Exp":
                return this.exp();
            case "x2":
                return this.x2(result);
            case "x3":
                return this.x3(result);
            case "ex":
                return this.ex(result);
            case "pi":
                return this.pi();
            case "fact":
                return this.factorial(result);
            case "ln":
                return this.ln(result);
            case "log10":
                return this.log10(result);
            case "exp":
                return this.exp();
            default:
                throw Error("Command not allowed");
        }
    };

    sqrt = (arg: number): void => {
        let result = Math.sqrt(arg).toFixed(9);
        this.emptyResult().addToResult(Number(result));
        this.saveToBack([`sqrt(${arg})`, "=", result]);
    };

    sqrt3 = (arg: number): void => {
        let result = Math.cbrt(arg).toFixed(9);
        this.emptyResult().addToResult(Number(result));
        this.saveToBack([`sqrt3(${arg})`, "=", result]);
    };

    exp = (): void => {
        let result = Math.E.toFixed(9);
        this.emptyResult().addToResult(Number(result));
    };

    x2 = (arg: number): void => {
        let result = Math.pow(+arg, 2);
        this.emptyResult().addToResult(result);
        this.saveToBack([`x2(${arg})`, "=", result]);
    };

    x3 = (arg: number): void => {
        let result = Math.pow(+arg, 3);
        this.emptyResult().addToResult(result);
        this.saveToBack([`sqr(${arg})`, "=", result]);
    };

    ex = (arg: number): void => {
        let result = Math.exp(+arg);
        this.emptyResult().addToResult(result);
        this.saveToBack([`exp(${arg})`, "=", result]);
    };

    pi = (): void => {
        let result = Math.PI.toFixed(9);
        this.emptyResult().addToResult(Number(result))
    };


    factorial = (arg: number): void => {
        if (+arg == 0 || +arg == 1) {
            this.emptyResult().addToResult(1);
        } else {
            let fact = +arg;
            for (let i = 1; i < +arg; i++) {
                fact *= i;
            }
            this.emptyResult().addToResult(fact);
            this.saveToBack([`!(${arg})`, "=", +this.getResult().join('')]);
        }
    };

    ln = (arg: number): void => {
        let result = Math.log(+arg);
        this.emptyResult().addToResult(result);
        this.saveToBack([`ln(${arg})`, "=", result]);
    };

    log10 = (arg: number): void => {
        let result = Math.log10(+arg);
        this.emptyResult().addToResult(result);
        this.saveToBack([`lon10(${arg})`, "=", result]);
    };

    geometry = (trigFunc: string): void => {
        let result = +this.getResult().join('');
        switch (trigFunc) {
            case "sin":
                return (this.sin(result));
            case "cos":
                return this.cos(result);
            case "tan":
                return this.tan(result);
            case "asin":
                return this.asin(result);
            case "acos":
                return this.acos(result);
            case "atan":
                return this.atan(result)
        }
    };

    sin = (arg: number): void => {
        let result = Math.sin(Number(arg)).toFixed(9);
        this.emptyResult().addToResult(+result);
        this.saveToBack([`sin(${arg})`, '=', result]);
    };

    cos = (arg: number): void => {
        let result = Math.cos(Number(arg)).toFixed(9);
        this.emptyResult().addToResult(+result);
        this.saveToBack([`cos(${arg})`, '=', result]);
    };

    tan = (arg: number): void => {
        let result = Math.tan(arg).toFixed(9);
        this.emptyResult().addToResult(+result);
        this.saveToBack([`tan(${arg})`, '=', result]);
    };

    asin = (arg: number): void => {
        let result = Math.sinh(arg).toFixed(9);
        this.emptyResult().addToResult(+result);
        this.saveToBack([`asin(${arg})`, '=', result]);
    };

    acos = (arg: number): void => {
        let result = Math.cosh(arg).toFixed(9);
        this.emptyResult().addToResult(+result);
        this.saveToBack([`acos(${arg})`, '=', result]);
    };

    atan = (arg: number): void => {
        let result = Math.tanh(arg).toFixed(9);
        this.emptyResult().addToResult(+result);
        this.saveToBack([`atan(${arg})`, '=', result]);
    }

}
