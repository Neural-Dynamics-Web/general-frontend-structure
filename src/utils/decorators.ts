// method decorator
export function APIExceptionCatch(target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    try {
      const result = originalMethod.apply(this, args)

      // Check if method is asynchronous
      if (result && result instanceof Promise) {
        // Return promise
        return result.catch((error: any) => {
          if (error?.response)
            return Promise.reject(error.response)
          return Promise.reject(error)
        })
      }

      // Return actual result
      return result
    } catch (error: any) {
      throw error
    }
  }

  return descriptor
}


// class decorator
export default function APIExceptionCatchAll(target: Function) {
  // Iterate over class properties except constructor
  for (const propertyName of Reflect.ownKeys(target.prototype).filter(prop => prop !== 'constructor')) {
    const desc = Object.getOwnPropertyDescriptor(target.prototype, propertyName)!
    const isMethod = desc.value instanceof Function
    if (!isMethod) continue
    Object.defineProperty(target.prototype, propertyName, APIExceptionCatch(target, '', desc))
  }
}