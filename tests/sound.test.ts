import { detectOS, playBeep, SoundOptions } from '../src/sound';

describe('sound', () => {
  describe('detectOS', () => {
    test('detects operating system', () => {
      const os = detectOS();
      expect(['windows', 'macos', 'linux']).toContain(os);
    });
  });

  describe('playBeep', () => {
    test('plays beep without throwing', () => {
      const options: SoundOptions = {
        frequency: 800,
        duration: 200,
        mode: 'bell',
      };
      
      // Should not throw, even if sound fails
      expect(() => playBeep(options)).not.toThrow();
    });

    test('handles bell mode', () => {
      const options: SoundOptions = {
        frequency: 800,
        duration: 200,
        mode: 'bell',
      };
      
      expect(() => playBeep(options)).not.toThrow();
    });

    test('handles auto mode', () => {
      const options: SoundOptions = {
        frequency: 800,
        duration: 200,
        mode: 'auto',
      };
      
      expect(() => playBeep(options)).not.toThrow();
    });

    test('handles native mode', () => {
      const options: SoundOptions = {
        frequency: 800,
        duration: 200,
        mode: 'native',
      };
      
      expect(() => playBeep(options)).not.toThrow();
    });
  });
});
