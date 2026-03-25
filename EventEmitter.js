export default class EventEmitter {
    constructor() {
        this.callbacks = {}
        this.callbacks.base = {}
    }

    on(_names, callback) {
        if (typeof _names === 'undefined' || _names === '') {
            console.warn('Wrong names')
            return false
        }
        if (typeof callback === 'undefined') {
            console.warn('Wrong callback')
            return false
        }
        const names = this.resolveNames(_names)
        names.forEach((_name) => {
            const name = this.resolveName(_name)
            if (!(this.callbacks[name.namespace] instanceof Object))
                this.callbacks[name.namespace] = {}
            if (!(this.callbacks[name.namespace][name.value] instanceof Array))
                this.callbacks[name.namespace][name.value] = []
            this.callbacks[name.namespace][name.value].push(callback)
        })
        return this
    }

    off(_names) {
        if (typeof _names === 'undefined' || _names === '') {
            console.warn('Wrong names')
            return false
        }
        const names = this.resolveNames(_names)
        names.forEach((_name) => {
            const name = this.resolveName(_name)
            if (this.callbacks[name.namespace] instanceof Object) {
                if (name.value !== '') {
                    if (this.callbacks[name.namespace][name.value] instanceof Array) {
                        delete this.callbacks[name.namespace][name.value]
                    }
                } else {
                    delete this.callbacks[name.namespace]
                }
            }
        })
        return this
    }

    trigger(_name, _args) {
        if (typeof _name === 'undefined' || _name === '') {
            console.warn('Wrong name')
            return false
        }
        let finalResult = null
        let result = null
        const names = this.resolveNames(_name)
        names.forEach((_name) => {
            const name = this.resolveName(_name)
            if (this.callbacks[name.namespace] instanceof Object) {
                if (this.callbacks[name.namespace][name.value] instanceof Array) {
                    this.callbacks[name.namespace][name.value].forEach((callback) => {
                        result = callback.apply(this, _args)
                        if (typeof result !== 'undefined') finalResult = result
                    })
                }
            }
        })
        return finalResult
    }

    resolveNames(_names) {
        let names = _names
        names = names.replace(/[^a-zA-Z0-9 ,/.]/g, '')
        names = names.replace(/[,/]+/g, ' ')
        names = names.split(' ')
        return names
    }

    resolveName(name) {
        const newName = {}
        const parts = name.split('.')
        newName.original = name
        newName.value = parts[0]
        newName.namespace = 'base'
        if (parts.length > 1 && parts[1] !== '') newName.namespace = parts[1]
        return newName
    }
}
