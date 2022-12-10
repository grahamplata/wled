import WLEDClient from '../src/client';

describe('WLED Client', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Configuration', () => {
    it('should be defined', () => {
      const wled = new WLEDClient('127.0.0.1');
      expect(wled).toBeDefined();
    });

    it('should accept string input', () => {
      const wled = new WLEDClient('127.0.0.1');
      expect(wled.endpoint).toBe('http://127.0.0.1/json');
    });

    it('should accept object input', () => {
      const wled = new WLEDClient({ host: '127.0.0.1' });
      expect(wled.endpoint).toBe('http://127.0.0.1/json');
    });

    it('should match a http endpoint', () => {
      const wled = new WLEDClient({ host: '127.0.0.1' });
      expect(wled.endpoint).toBe('http://127.0.0.1/json');
    });

    it('should match a https endpoint', () => {
      const wled = new WLEDClient({ host: '127.0.0.1', https: true });
      expect(wled.endpoint).toBe('https://127.0.0.1/json');
    });

    it('should match a secure endpoint with a port', () => {
      const wled = new WLEDClient({
        host: '127.0.0.1',
        https: true,
        port: 1234,
      });
      expect(wled.endpoint).toBe('https://127.0.0.1:1234/json');
    });

    it('should fail to connect', () => {
      const wled = new WLEDClient('127.0.0.1');
      expect(wled.isConnected).toBe(false);
    });
  });

  describe('Request', () => {
    it('should add tests', () => {
      expect(true).toEqual(true);
    });
  });

  describe('Device Info', () => {
    it('should add tests', () => {
      expect(true).toEqual(true);
    });
  });

  describe('State', () => {
    it('should add tests', () => {
      expect(true).toEqual(true);
    });
  });

  describe('Effects', () => {
    it('should add tests', () => {
      expect(true).toEqual(true);
    });
  });

  describe('Palettes', () => {
    it('should add tests', () => {
      expect(true).toEqual(true);
    });
  });
});
