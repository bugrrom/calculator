import CalcEvent from "./Event";
import {ICalcButtons} from "./index";

export type CalcTypes = "simple" | "eng" | "prog" | "default" | null;

export class CalculatorSimpleView {
    maxChainLength = 28;
    events: object = {};
    buttons: object;
    modeChangedEvent = new CalcEvent(this);
    currentMode: CalcTypes = null;

    constructor(private chainElement: HTMLElement, private resultElement: HTMLElement, private buttonsIdsObjects: Array<ICalcButtons>) {

        //this.eventsNames = buttonsIdsObjects.find(o => o.type === "simple").ids.map(id => id + "Clicked");

        this.chainElement = chainElement;
        this.resultElement = resultElement;
        // this.buttons = this.createButtons(buttonsElements);
        this.buttons = this.getButtons(buttonsIdsObjects);
        this.bindSwitchModeClicks();
        this.attachListeners("simple")
    }

    subscribe = (eventName: string, callback): void => {
        if (this.events[eventName] && this.events[eventName].listeners.length === 0) {
            this.events[eventName].attach(callback);
        }
    };

    getButtons = (btnsIds: Array<ICalcButtons>): object => {
        let buttonsHtmlElements = {};
        btnsIds.forEach(id => id.ids.forEach(el => buttonsHtmlElements[el] = document.getElementById(el)));
        return buttonsHtmlElements
    };

    bindSwitchModeClicks(): void {
        document.querySelectorAll("[data-role='switch-mode']").forEach(btn => {
            document.getElementById("default").style.backgroundColor = '#468506';
            btn.addEventListener("click", (e) => {
                document.querySelectorAll("[data-role='switch-mode']").forEach((el: HTMLElement) => {
                    el.style.backgroundColor = ""
                });
                //hide all additional modes
                document.querySelectorAll("[data-role='calc-mode']").forEach((el: HTMLElement) => {
                    el.style.display = "none";
                });

                /*  // not touch simple events
                  this.buttonsIdsObjects.filter(o => o.type !== "simple").forEach(o => {
                      // remove html events subscribers
                      o.unsubscribesFunctions.forEach(f => f());
                      // remove view events subscribers
                      o.ids.forEach(id => {
                          delete this.events[id + "Clicked"];
                      })
                  });*/

                let type: any = (e.currentTarget as HTMLElement).dataset.type;
                document.getElementById(type).style.backgroundColor = '#468506';
                this.disableButton("def");
                if (type !== "default") {
                    let modeHtml = document.querySelector(`[data-role='calc-mode'][data-type='${type}']`) as HTMLElement;

                    if (modeHtml != null) {
                        modeHtml.style.display = "block";
                        this.attachListeners(type);
                        this.modeChangedEvent.notify();
                        if (type === "prog") {
                            this.checkBin();
                            this.disableButton("dec")
                        }
                    } else {
                        console.error("incorrect mode type");
                    }
                }
            })
        })
    }

    getMaxResultDisplayLength = (): number => {
        return 13;
    };

    shortenNumber = (number: number): string => {
        if (number < 0)
            return Number(number).toExponential(this.getMaxResultDisplayLength() - 7);
        return Number(number).toExponential(this.getMaxResultDisplayLength() - 6)
    };

    shortenChain = (chain: Array<string | number>) => {
        return (
            "&laquo; " +
            chain.join("").substr(chain.join("").length - this.maxChainLength)
        )
    };

    isItOperator = (element: any): any => {
        return isNaN(element) && /[+=/x-]/.test(element)
    };

    isNumberTooLong = (number: string): boolean => {
        return number.toString().length > this.getMaxResultDisplayLength();
    };

    addSpaceToOperators = (operator: string): string => {
        return " " + operator + " ";
    };

    addSpaceToChain = (chain: Array<any>): void => {
        chain.forEach((element, index, array) => {
            if (this.isItOperator(element)) array[index] = this.addSpaceToOperators(element);
        })
    };

    isNumber = (n: any): boolean => {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    shortenLongNumbers = (chain: Array<any>): void => {
        chain.forEach((element, index, array) => {
            if (this.isNumber(element))
                if (this.isNumberTooLong(element)) array[index] = this.shortenNumber(element);
        });
    };

    renderResult = (result): void => {
        this.resultElement.innerHTML = result.join("");
        if (result.join("").length > this.getMaxResultDisplayLength())
            this.resultElement.innerHTML = this.shortenNumber(result);
    };

    renderChain = (chain): void => {
        this.addSpaceToChain(chain);
        this.shortenLongNumbers(chain);
        this.chainElement.innerHTML = chain.join("");
        if (chain.join("").length > this.maxChainLength)
            this.chainElement.innerHTML = this.shortenChain(chain);
    };

    attachListeners = (mode: CalcTypes) => {

        if (this.currentMode === mode) return;

        let obj = this.buttonsIdsObjects.find(o => o.type === mode);

        let prevActiveModePresents = this.currentMode != null;
        let prevModeNotSimple = this.currentMode !== "simple"; // we shouldn't destroy simple Calc events
        let newModeIsDifferent = this.currentMode !== mode;

        if (prevActiveModePresents && prevModeNotSimple && newModeIsDifferent) {
            let prevObj = this.buttonsIdsObjects.find(o => o.type === this.currentMode);

            // disconnect all controller's listeners
            prevObj.ids.forEach(id => {
                delete this.events[id + "Clicked"];
            });

            // unsubscribe HTML events
            prevObj.unsubscribesFunctions.forEach(unsFunc => unsFunc());
            //Object.keys(this.events).forEach(key => this.events[key].listeners = []);
        }

        //  Object.keys(this.events).forEach(key => this.events[key].listeners = []);
        //  this.events = {};
        obj.ids
            .forEach(id => {
                this.events[id + "Clicked"] = new CalcEvent(this);
                let unsubscribe = this.attachListener(id, `${id}Clicked`);
                obj.unsubscribesFunctions.push(unsubscribe);

            });

        this.currentMode = mode;
    };

    attachListener = (btnName, eventName): any => {
        try {
            let callback = () => {
                this.events[eventName].notify();
            };
            this.buttons[btnName].addEventListener("click", callback);

            return () => {
                this.buttons[btnName].removeEventListener("click", callback)
            };
        } catch {
            return () => {
                console.warn("stub function")
            }
        }

    };

    render = (viewModel): void => {
        this.renderResult(viewModel.result);
        this.renderChain(viewModel.chain)
    };

    getResult = () => {
        return this.resultElement.innerHTML;
    };

    getChain = () => {
        return this.chainElement.innerHTML;
    };

    checkBin = (): void => {
        let c: any = document.getElementsByName('sis');
        if (!c[1].checked) c[1].checked = true;
    };

    disableButton = (arg: string): void => {
        let positionalNumberSystem = {
            buttonsDisabled: ["num2", "num3", "num4", "num5", "num6", "num7", "num8", "num9", "dot", "A", "B", "Ci", "D", "E", "F"],
            system: [
                {
                    numberSystem: "bin",
                    disabled: ["num2", "num3", "num4", "num5", "num6", "num7", "num8", "num9", "dot", "A", "B", "Ci", "D", "E", "F"]
                },
                {
                    numberSystem: "oct",
                    disabled: ["num8", "num9", "dot", "A", "B", "Ci", "D", "E", "F"]
                },
                {
                    numberSystem: "dec",
                    disabled: ["dot", "A", "B", "Ci", "D", "E", "F"]
                },
                {
                    numberSystem: "hex",
                    disabled: ["dot"]
                }
            ]
        };
        positionalNumberSystem.buttonsDisabled.forEach(el => this.buttons[el].disabled = false);
        positionalNumberSystem.system.forEach(el => {
            if (el.numberSystem === arg) {
                el.disabled.forEach(el => this.buttons[el].disabled = true)
            }
        })
    }
}

