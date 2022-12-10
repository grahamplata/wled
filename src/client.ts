// TODO: @gplata
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */

import IsomorphicEventEmitter from './emitter';

/**
 * WLED Client Connection Options
 * @typedef {Object} ClientRetryOptions
 */
export interface ClientRetryOptions {
  /**
   * Client should attempt to reconnect
   */
  retry?: boolean;

  /**
   * Additional time between attempts.
   */
  decay?: number;

  /**
   * Time interval between attempts.
   */
  interval?: number;
}

/**
 * WLED Client Options
 * @typedef {Object} WLEDClientOptions
 */
export interface WLEDClientOptions {
  /**
   * IP Address or host of WLED enabled device.
   */
  host: string;

  /**
   * Secure http enabled
   */
  https?: boolean;

  /**
   * Port of WLED enabled device.
   */
  port?: number;

  /**
   * Client retry Options
   */
  retryOptions?: ClientRetryOptions;
}

export const DEFAULT_DECAY = 1.5;

export const DEFAULT_INTERVAL = 1000;

export const DEFAULT_CLIENT_OPTIONS: WLEDClientOptions = {
  host: '',
  https: false,
  retryOptions: {
    retry: false,
    decay: DEFAULT_DECAY,
    interval: DEFAULT_INTERVAL,
  },
};

/**
 * WLEDClient Client instance
 *
 * WLEDClient enables the user to control and monitor a WLED device via the JSON API.
 * https://kno.wled.ge/interfaces/http-api/
 *
 */
class WLEDClient extends IsomorphicEventEmitter {
  /** Connection established */
  public readonly isConnected: boolean;

  /** Connection Attempts */
  public readonly connectionAttempts: number;

  /** Client target endpoint */
  public endpoint: string;

  /** Client Timeout */
  public readonly timeout: number;

  /** Client options */
  private options: WLEDClientOptions;

  /**
   * IP Address or host of WLED enabled device.
   * @param {string} host
   */
  constructor(host: string);

  /**
   * WLED Client Options
   * @param {Partial<WLEDClientOptions>} options
   */
  constructor(options: Partial<WLEDClientOptions>);

  /**
   * WLED Client Options
   * @param {string | Partial<WLEDClientOptions>} options
   */
  constructor(config: string | Partial<WLEDClientOptions> = {}) {
    // Call reference to base class
    super();

    // Client connected
    this.isConnected = false;

    // Client connected
    this.endpoint = '';

    // Default Api Connection Attempts
    this.connectionAttempts = 0;

    // Default Api Request timeout
    this.timeout = 5000;

    let options: Partial<WLEDClientOptions>;
    // Constructs options object with optional properties.
    if (typeof config == 'string') options = { host: config };
    else options = config;

    // Merge config over config defaults
    const mergedOptions = Object.assign(DEFAULT_CLIENT_OPTIONS, options);
    this.options = mergedOptions;

    this.makeEndpoint();
  }

  /**
   * Builds endpoint from supplied options
   */
  private makeEndpoint(): void {
    // Build endpoint url
    this.endpoint = `${this.options.https ? 'https' : 'http'}://${
      this.options.host
    }${this.options.port ? `:${this.options.port}` : ''}/json`;
  }

  /**
   * A wrapper around `fetch()` enabling the use of `AbortController`
   *
   * @param {string} uri
   * @param {any} options
   * @returns
   */
  private async fetch(uri: string, options?: any) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);
    const response = await fetch(uri, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);

    return response;
  }

  /**
   * Error handler helper function
   *
   * @param {Response} response
   * @returns
   */
  private handleErrors(response: Response) {
    if (!response.ok) {
      this.emit('error', response);
      throw response;
    }
    return response;
  }

  /**
   * Queries the device info endpoint
   * https://kno.wled.ge/interfaces/json-api/#info-object
   *
   * @returns {object} data
   */
  async getInfo() {
    const response = await this.fetch(`${this.endpoint}/info`, {
      timeout: this.timeout,
    }).then(this.handleErrors);
    const data = await response.json();
    return data;
  }

  /**
   * Queries the state endpoint
   * https://kno.wled.ge/interfaces/json-api/#state-object
   *
   * @returns {object} data
   */
  async getState() {
    const response = await this.fetch(`${this.endpoint}/state`, {
      timeout: this.timeout,
    }).then(this.handleErrors);
    const data = await response.json();
    return data;
  }

  /**
   * Queries the presets endpoint
   * https://kno.wled.ge/interfaces/json-api/#state-object
   *
   * @returns {object} data
   */
  async getPresets() {
    const response = await this.fetch(`${this.endpoint}/presets`, {
      timeout: this.timeout,
    }).then(this.handleErrors);
    const data = await response.json();
    return data;
  }

  /**
   * Queries the config endpoint
   * https://kno.wled.ge/interfaces/json-api/#state-object
   *
   * @returns {object} data
   */
  async getConfig() {
    const response = await this.fetch(`${this.endpoint}/cfg`, {
      timeout: this.timeout,
    }).then(this.handleErrors);
    const data = await response.json();
    return data;
  }
}

export default WLEDClient;
