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

    test('handles pattern with repeat', async () => {
      const config: BeepConfig = {
        pattern: 's-s-l',
        repeat: 2,
        soundMode: 'bell',
      };
      
      const start = Date.now();
      await playBeepWithConfig(config);
      const elapsed = Date.now() - start;
      
      // Should take longer due to repeat
      expect(elapsed).toBeGreaterThan(100);
      await expect(playBeepWithConfig(config)).resolves.not.toThrow();
    });

    test('handles pattern with delay', async () => {
      const config: BeepConfig = {
        pattern: 'mario',
        delay: 20,
        soundMode: 'bell',
      };
      
      const start = Date.now();
      await playBeepWithConfig(config);
      const elapsed = Date.now() - start;
      
      expect(elapsed).toBeGreaterThanOrEqual(20);
    });

    test('handles pattern with repeat and delay', async () => {
      const config: BeepConfig = {
        pattern: 'success',
        repeat: 2,
        delay: 10,
        soundMode: 'bell',
      };
      
      const start = Date.now();
      await playBeepWithConfig(config);
      const elapsed = Date.now() - start;
      
      expect(elapsed).toBeGreaterThanOrEqual(10);
      await expect(playBeepWithConfig(config)).resolves.not.toThrow();
    });

    test('handles multiple repeat', async () => {
      const config: BeepConfig = {
        frequency: 800,
        duration: 50,
        repeat: 3,
        soundMode: 'bell',
      };
      
      const start = Date.now();
      await playBeepWithConfig(config);
      const elapsed = Date.now() - start;
      
      // Should take longer with 3 repeats
      expect(elapsed).toBeGreaterThan(100);
      await expect(playBeepWithConfig(config)).resolves.not.toThrow();
    });

    test('handles zero delay', async () => {
      const config: BeepConfig = {
        frequency: 800,
        duration: 100,
        delay: 0,
        soundMode: 'bell',
      };
      
      await expect(playBeepWithConfig(config)).resolves.not.toThrow();
    });

    test('handles default values', async () => {
      const config: BeepConfig = {
        soundMode: 'bell',
      };
      
      await expect(playBeepWithConfig(config)).resolves.not.toThrow();
    });

    test('handles verbose mode', async () => {
      const config: BeepConfig = {
        frequency: 800,
        duration: 100,
        verbose: true,
        soundMode: 'bell',
      };
      
      await expect(playBeepWithConfig(config)).resolves.not.toThrow();
    });

    test('handles verbose mode with pattern', async () => {
      const config: BeepConfig = {
        pattern: 'mario',
        verbose: true,
        soundMode: 'bell',
      };
      
      await expect(playBeepWithConfig(config)).resolves.not.toThrow();
    });

    test('handles all sound modes', async () => {
      const modes: Array<'auto' | 'bell' | 'native'> = ['auto', 'bell', 'native'];
      
      for (const mode of modes) {
        const config: BeepConfig = {
          frequency: 800,
          duration: 100,
          soundMode: mode,
        };
        
        await expect(playBeepWithConfig(config)).resolves.not.toThrow();
      }
    });

    test('handles different frequency ranges', async () => {
      const frequencies = [200, 500, 1000, 2000, 4000];
      
      for (const freq of frequencies) {
        const config: BeepConfig = {
          frequency: freq,
          duration: 100,
          soundMode: 'bell',
        };
        
        await expect(playBeepWithConfig(config)).resolves.not.toThrow();
      }
    });

    test('handles different duration ranges', async () => {
      const durations = [50, 100, 300, 500, 1000];
      
      for (const dur of durations) {
        const config: BeepConfig = {
          frequency: 800,
          duration: dur,
          soundMode: 'bell',
        };
        
        await expect(playBeepWithConfig(config)).resolves.not.toThrow();
      }
    });

    test('handles success pattern', async () => {
      const config: BeepConfig = {
        pattern: 'success',
        soundMode: 'bell',
      };
      
      await expect(playBeepWithConfig(config)).resolves.not.toThrow();
    });

    test('handles error pattern', async () => {
      const config: BeepConfig = {
        pattern: 'error',
        soundMode: 'bell',
      };
      
      await expect(playBeepWithConfig(config)).resolves.not.toThrow();
    });

    test('handles warning pattern', async () => {
      const config: BeepConfig = {
        pattern: 'warning',
        soundMode: 'bell',
      };
      
      await expect(playBeepWithConfig(config)).resolves.not.toThrow();
    });
  });
});
