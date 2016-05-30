'use strict';

// ((a → Promise b), (b → Promise c), …, (y → Promise z)) → (a → Promise z)
export function pipeP(head, ...promises): (any)=>Promise<any> {
    const context = this;
    return function (): Promise<any> {
        try {
            let result = head;
            if (typeof head === 'function') {
                result = head.call(context, ...arguments)
            }

            return Promise.resolve(result).then((result) => {
                if (promises.length == 0) {
                    return result
                } else {
                    const [next, ...tail] = promises;

                    return pipeP(next, ...tail)(result)
                }
            })
        } catch (err) {
            return Promise.reject(err.message);
        }
    }
}