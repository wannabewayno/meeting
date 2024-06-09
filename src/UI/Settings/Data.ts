import { EventEmitter } from "stream";

/**
 * Proxy wrapper that emits a "change" event whenever data is modified on the underlying instance.
 */
export class Data<T extends Record<string, any>> extends EventEmitter {
    private data: T

    constructor(data: T) {
        super();
        this.data = data;

        return new Proxy(this, {
            get: (target, prop: string, receiver) => {
                if (prop in target) return Reflect.get(target, prop, receiver);
                return target.data[prop as keyof T];
            },
            set: (target, prop: string, value, receiver) => {
                if (prop in target) return Reflect.set(target, prop, value, receiver);
                target.data[prop as keyof T] = value;
                target.emit('change', prop, value);
                return true;
            }
        });
    }

    getData() {
        return this.data;
    }
}