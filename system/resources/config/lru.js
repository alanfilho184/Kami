module.exports = class lruCache {
    constructor(options) {
        this.map = new Map()
        this.maxAge = options.maxAge || 0
        this.updateAgeOnGet = options.updateAgeOnGet || false
        this.age()
    }

    age() {
        setInterval(() => {
            this.map.forEach(info => {
                try { info = JSON.parse(info) } catch (err) { }
                if (Date.now() - info.usedAt >= info.maxAge && info.maxAge != 0) {
                    this.map.delete(info.key)
                }
            })
        }, 60000)
    }

    set(key, value, maxAge) {
        this.map.set(key, JSON.stringify({ key: key, content: value, maxAge: maxAge || this.maxAge, creationTime: Date.now(), usedAt: Date.now() }))

        return "Setado com sucesso"
    }

    get(key) {
        let toReturn

        try {
            toReturn = this.map.get(key).content

            if (this.updateAgeOnGet) {
                this.map.set(key, JSON.stringify({ key: key, content: this.map.get(key).content, maxAge: this.map.get(key).maxAge || this.maxAge, creationTime: this.map.get(key).creationTime, usedAt: Date.now() }))
            }
        }
        catch (err) {
            toReturn = undefined
        }

        try { toReturn = JSON.parse(toReturn) } catch (err) { }

        return toReturn
    }

    delete(key) {
        this.map.delete(key)

        return "Deletado com sucesso"
    }

    has(key) {
        if (this.map.get(key)) { return true }
        else { return false }
    }

    length() {
        return this.map.size
    }
}