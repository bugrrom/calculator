export default class CalcEvent {
    listeners: any = [];

    constructor(private sender: any) {

    }

    attach(listener: (sender: any) => void): void {
        this.listeners.push(listener)
    }

    notify(): void {
        for (let index = 0; index < this.listeners.length; index += 1) {
            this.listeners[index](this.sender)
        }
    }
}