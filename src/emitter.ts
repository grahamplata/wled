/**
 * Check if event is a custom event.
 *
 * @param event any
 * @returns event
 */
function isCustomEvent(event: any): event is CustomEvent {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return !!event.detail;
}

class IsomorphicCustomEvent<T = any> extends Event {
  detail?: T;
  constructor(typeArg: string, eventInitDict?: CustomEventInit<T>) {
    super(typeArg, eventInitDict);
    this.detail = eventInitDict?.detail;
  }
}

/**
 * A custom EventEmitter class, used to handle custon events for WLED object also exposes several other methods to interact with events
 */
export default class IsomorphicEventEmitter extends EventTarget {
  /**
   *
   * @param {string} eventName
   * @param {Function} listener
   * @returns {void}
   */
  on(eventName: string, listener: (...args: any[]) => void) {
    return this.addEventListener(eventName, (event: Event | CustomEvent) => {
      if (isCustomEvent(event)) return listener(...event.detail);
      listener(event);
    });
  }

  /**
   * Adds a one-time use event listener
   *
   * @param {string} eventName
   * @param {Function} listener
   * @returns {void}
   */
  once(eventName: string, listener: (...args: any[]) => void) {
    const event_listener = this.on(eventName, listener);
    this.addEventListener(eventName, () => this.off(eventName, listener));
    return event_listener;
  }

  /**
   * Remove an event listener from an event
   *
   * @param {string} eventName
   * @param {Function} listener
   * @returns {void}
   */
  off(eventName: string, listener: (...args: any[]) => void) {
    return this.removeEventListener(eventName, listener);
  }

  /**
   * Extends emit to pass arguments to the event handler
   *
   * @param {string} eventName
   * @param {Function} listener
   * @returns {void}
   */
  emit<T extends any[]>(eventName: string, ...args: T) {
    const event = new IsomorphicCustomEvent(eventName, { detail: args });
    return this.dispatchEvent(event);
  }
}
