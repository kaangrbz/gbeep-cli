import { playBeepWithConfig, BeepConfig } from '../src/beep';

describe('beep', () => {
  describe('playBeepWithConfig', () => {
    test('plays simple beep without throwing', async () => {
      const config: BeepConfig = {
        frequency: 800,
        duration: 200,
        soundMode: 'bell',
      };
      
      await expect(playBeepWithConfig(config)).resolves.not.toThrow();
    });

    test('handles pattern', async () => {
      const config: BeepConfig = {
        pattern: 's-s-l',
        soundMode: 'bell',
      };
      
      await expect(playBeepWithConfig(config)).resolves.not.toThrow();
    });

    test('handles repeat', async () => {
      const config: BeepConfig = {
        frequency: 800,
        duration: 100,
        repeat: 2,
        soundMode: 'bell',
      };
      
      await expect(playBeepWithConfig(config)).resolves.not.toThrow();
    });

    test('handles delay', async () => {
      const config: BeepConfig = {
        frequency: 800,
        duration: 100,
        delay: 10,
        soundMode: 'bell',
      };
      
      const start = Date.now();
      await playBeepWithConfig(config);
      const elapsed = Date.now() - start;
      
      expect(elapsed).toBeGreaterThanOrEqual(10);
    });

    test('handles mario pattern', async () => {
      const config: BeepConfig = {
        pattern: 'mario',
        soundMode: 'bell',
      };
      
      await expect(playBeepWithConfig(config)).resolves.not.toThrow();
    });
  });
});
