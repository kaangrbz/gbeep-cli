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
  });
});
