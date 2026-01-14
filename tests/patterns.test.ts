import { parsePattern, BeepNote } from '../src/patterns';

describe('parsePattern', () => {
  describe('preset patterns', () => {
    test('mario pattern', () => {
      const notes = parsePattern('mario');
      expect(notes).toHaveLength(3);
      expect(notes[0].frequency).toBe(659);
      expect(notes[1].frequency).toBe(784);
      expect(notes[2].frequency).toBe(988);
    });

    test('success pattern', () => {
      const notes = parsePattern('success', 1000);
      expect(notes).toHaveLength(2);
      expect(notes[0].frequency).toBe(1000);
      expect(notes[1].frequency).toBeGreaterThan(1000);
    });

    test('error pattern', () => {
      const notes = parsePattern('error', 800);
      expect(notes).toHaveLength(3);
      expect(notes[0].duration).toBe(200);
      expect(notes[1].duration).toBe(200);
      expect(notes[2].duration).toBe(500);
    });

    test('warning pattern', () => {
      const notes = parsePattern('warning', 1000);
      expect(notes).toHaveLength(2);
    });
  });

  describe('short syntax', () => {
    test('s-s-l pattern', () => {
      const notes = parsePattern('s-s-l', 1000);
      expect(notes).toHaveLength(3);
      expect(notes[0].duration).toBe(200);
      expect(notes[1].duration).toBe(200);
      expect(notes[2].duration).toBe(500);
    });

    test('s-m-l pattern', () => {
      const notes = parsePattern('s-m-l', 1000);
      expect(notes).toHaveLength(3);
      expect(notes[0].duration).toBe(200);
      expect(notes[1].duration).toBe(300);
      expect(notes[2].duration).toBe(500);
    });
  });

  describe('comma-separated durations', () => {
    test('simple duration list', () => {
      const notes = parsePattern('200,100,400', 1000);
      expect(notes).toHaveLength(3);
      expect(notes[0].duration).toBe(200);
      expect(notes[1].duration).toBe(100);
      expect(notes[2].duration).toBe(400);
    });

    test('single duration', () => {
      const notes = parsePattern('300', 1000);
      expect(notes).toHaveLength(1);
      expect(notes[0].duration).toBe(300);
    });
  });

  describe('edge cases', () => {
    test('empty string defaults to single beep', () => {
      const notes = parsePattern('', 1000);
      expect(notes.length).toBeGreaterThan(0);
    });

    test('invalid pattern defaults to single beep', () => {
      const notes = parsePattern('invalid', 1000);
      expect(notes.length).toBeGreaterThan(0);
    });

    test('whitespace-only pattern defaults to single beep', () => {
      const notes = parsePattern('   ', 1000);
      expect(notes.length).toBeGreaterThan(0);
    });

    test('pattern with leading/trailing spaces', () => {
      const notes = parsePattern('  mario  ', 1000);
      expect(notes).toHaveLength(3);
      expect(notes[0].frequency).toBe(659);
    });

    test('case-insensitive preset patterns', () => {
      const mario1 = parsePattern('MARIO', 1000);
      const mario2 = parsePattern('Mario', 1000);
      const mario3 = parsePattern('mario', 1000);
      
      expect(mario1).toEqual(mario2);
      expect(mario2).toEqual(mario3);
    });

    test('comma-separated with spaces', () => {
      const notes = parsePattern('200 , 100 , 400', 1000);
      expect(notes).toHaveLength(3);
      expect(notes[0].duration).toBe(200);
      expect(notes[1].duration).toBe(100);
      expect(notes[2].duration).toBe(400);
    });

    test('short syntax with spaces', () => {
      const notes = parsePattern('s - s - l', 1000);
      expect(notes).toHaveLength(3);
    });

    test('single number duration', () => {
      const notes = parsePattern('500', 1000);
      expect(notes).toHaveLength(1);
      expect(notes[0].duration).toBe(500);
    });

    test('very long duration list', () => {
      const pattern = Array(10).fill('100').join(',');
      const notes = parsePattern(pattern, 1000);
      expect(notes).toHaveLength(10);
      notes.forEach(note => {
        expect(note.duration).toBe(100);
      });
    });

    test('short syntax variations', () => {
      const patterns = ['s-m-l', 'short-medium-long', 's-s-s'];
      
      for (const pattern of patterns) {
        const notes = parsePattern(pattern, 1000);
        expect(notes.length).toBeGreaterThan(0);
      }
    });

    test('invalid duration values are skipped', () => {
      const notes = parsePattern('200,abc,100,xyz,400', 1000);
      // Should only parse valid numbers
      expect(notes.length).toBeGreaterThan(0);
      expect(notes.every(n => !isNaN(n.duration))).toBe(true);
    });

    test('zero duration is skipped', () => {
      const notes = parsePattern('200,0,100', 1000);
      // Zero durations should be filtered out
      expect(notes.every(n => n.duration > 0)).toBe(true);
    });

    test('negative duration is skipped', () => {
      const notes = parsePattern('200,-100,100', 1000);
      expect(notes.every(n => n.duration > 0)).toBe(true);
    });

    test('default frequency is used when not specified', () => {
      const notes = parsePattern('200,100,400', 1500);
      notes.forEach(note => {
        expect(note.frequency).toBe(1500);
      });
    });
  });
});
