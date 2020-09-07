export class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  subscribe(eventName, listener) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(listener);
    return () => {
      this.unsubscribe(eventName, listener);
    };
  }

  unsubscribe(eventName, listener) {
    if (!Array.isArray(this.listeners[eventName])) {
      return false;
    }
    this.listeners[eventName] = this.listeners[eventName].filter(
      (ls) => ls !== listener
    );
    return true;
  }

  emit(eventName, ...args) {
    if (!Array.isArray(this.listeners[eventName])) {
      return false;
    }
    this.listeners[eventName].forEach((listener) => listener(...args));
    return true;
  }
}
