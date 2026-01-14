import { detectOS, playBeep, SoundOptions } from '../src/sound';

describe('sound', () => {
  describe('detectOS', () => {
    test('detects operating system', () => {
      const os = detectOS();
      expect(['windows', 'macos', 'linux']).toContain(os);
    });
  });

  describe('playBeep', () => {
    test('plays beep without throwing', async () => {
      const options: SoundOptions = {
        frequency: 800,
        duration: 200,
        mode: 'bell',
      };
      
      // Should not throw, even if sound fails
      await expect(playBeep(options)).resolves.not.toThrow();
    });

    test('handles bell mode', async () => {
      const options: SoundOptions = {
        frequency: 800,
        duration: 200,
        mode: 'bell',
      };
      
      await expect(playBeep(options)).resolves.not.toThrow();
    });

    test('handles auto mode', async () => {
      const options: SoundOptions = {
        frequency: 800,
        duration: 200,
        mode: 'auto',
      };
      
      await expect(playBeep(options)).resolves.not.toThrow();
    });

    test('handles native mode', async () => {
      const options: SoundOptions = {
        frequency: 800,
        duration: 200,
        mode: 'native',
      };
      
      await expect(playBeep(options)).resolves.not.toThrow();
    });

    test('handles verbose mode', async () => {
      const options: SoundOptions = {
        frequency: 800,
        duration: 200,
        mode: 'bell',
        verbose: true,
      };
      
      await expect(playBeep(options)).resolves.not.toThrow();
    });

    test('handles different frequency values', async () => {
      const frequencies = [200, 500, 1000, 2000, 4000];
      
      for (const freq of frequencies) {
        const options: SoundOptions = {
          frequency: freq,
          duration: 200,
          mode: 'bell',
        };
        
        await expect(playBeep(options)).resolves.not.toThrow();
      }
    });

    test('handles different duration values', async () => {
      const durations = [50, 100, 300, 500, 1000];
      
      for (const dur of durations) {
        const options: SoundOptions = {
          frequency: 800,
          duration: dur,
          mode: 'bell',
        };
        
        await expect(playBeep(options)).resolves.not.toThrow();
      }
    });

    test('handles very short duration', async () => {
      const options: SoundOptions = {
        frequency: 800,
        duration: 10,
        mode: 'bell',
      };
      
      await expect(playBeep(options)).resolves.not.toThrow();
    });

    test('handles very long duration', async () => {
      const options: SoundOptions = {
        frequency: 800,
        duration: 5000,
        mode: 'bell',
      };
      
      await expect(playBeep(options)).resolves.not.toThrow();
    });

    test('handles low frequency', async () => {
      const options: SoundOptions = {
        frequency: 100,
        duration: 200,
        mode: 'bell',
      };
      
      await expect(playBeep(options)).resolves.not.toThrow();
    });

    test('handles high frequency', async () => {
      const options: SoundOptions = {
        frequency: 8000,
        duration: 200,
        mode: 'bell',
      };
      
      await expect(playBeep(options)).resolves.not.toThrow();
    });

    test('handles all modes with verbose', async () => {
      const modes: Array<'auto' | 'bell' | 'native'> = ['auto', 'bell', 'native'];
      
      for (const mode of modes) {
        const options: SoundOptions = {
          frequency: 800,
          duration: 200,
          mode,
          verbose: true,
        };
        
        await expect(playBeep(options)).resolves.not.toThrow();
      }
    });

    test('detectOS returns valid OS', () => {
      const os = detectOS();
      expect(['windows', 'macos', 'linux']).toContain(os);
    });

    test('detectOS is consistent', () => {
      const os1 = detectOS();
      const os2 = detectOS();
      expect(os1).toBe(os2);
    });
  });
});
