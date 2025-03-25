class EventEmitter {
    events: { [key: string]: Array<Function> }
    constructor() {
        this.events = {}
    }

    on(event: string, listener: Function) {
        if (typeof this.events[event] !== 'object') {
            this.events[event] = []
        }

        this.events[event].push(listener)
    }

    off(event: string, listener: Function) {
        if (typeof this.events[event] === 'object') {
            const idx = this.events[event].indexOf(listener)

            if (idx > -1) {
                this.events[event].splice(idx, 1)
            }
        }
    }

    once(event: string, listener: Function) {
        this.on(event, (...args: any[]) => {
            listener.apply(this, args)
            this.off(event, listener)
        })
    }

    emit(event: string, ...args: any[]) {
        if (typeof this.events[event] === 'object') {
            this.events[event].forEach((listener) => listener.apply(this, args))
        }
    }

    removeListener(event: string, callback: Function) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter((listener) => listener !== callback)
        }
    }
}

const eventEmitter = new EventEmitter()

export default eventEmitter

