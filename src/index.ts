import {CalculatorSimpleView} from "./CalculatorView";
import CalculatorModel from "./CalculatorModel";
import "./style.css"
import CalculatorController from "./CalculatorController";

export interface ICalcButtons {
    ids: Array<string>,
    type: string,
    unsubscribesFunctions: Array<any>
}

document.addEventListener("DOMContentLoaded", function () {
    const simpleCalcButtonsIds: ICalcButtons = {
        ids: [
            "ce", "c", "backspace", "division", "num7", "num8", "num9", "multiplication", "num4",
            "num5", "num6", "subtraction", "num1", "num2", "num3", "addition", "num0",
            "dot", "equals"
        ],
        type: "simple",
        unsubscribesFunctions: []
    };
    const engCalcButtonsIds: ICalcButtons = {
        ids: [
            "sqrt", "sqrt3", "exp", "x2", "x3", "ex", "sin",
            "cos", "tan", "pi", "asin", "acos", "atan", "ln", "log10", "fact"
        ],
        type: "eng",
        unsubscribesFunctions: []
    };
    const progsCalcButtonsIds: ICalcButtons = {
        ids: [
            "bit8", "bit4", "bit2", "bit1",
            "hex", "dec", "oct", "bin", "A", "B", "Ci", "D", "E", "F"
        ],
        type: "prog",
        unsubscribesFunctions: []
    };


    const view = new CalculatorSimpleView(
        document.getElementById("chain"),
        document.getElementById("result"),
        [simpleCalcButtonsIds, engCalcButtonsIds, progsCalcButtonsIds]
    );


    const model = new CalculatorModel();
    const controller = new CalculatorController(model, view);
});
