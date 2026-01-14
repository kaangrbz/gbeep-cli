export interface BeepNote {
  frequency: number;
  duration: number;
  pause?: number; // pause after this note in ms
}

export type PatternPreset = 'success' | 'error' | 'warning' | 'mario';

/**
 * Parse a pattern string into beep notes
 * Supports:
 * - Comma-separated durations: "200,100,200,100,400"
 * - Short syntax: "s-s-l" (short-short-long)
 * - Preset names: "mario", "success", "error", "warning"
 */
export function parsePattern(
  pattern: string,
  defaultFrequency: number = 1200
): BeepNote[] {
  const trimmed = pattern.trim().toLowerCase();
  
  // Check for preset patterns
  if (trimmed === 'mario') {
    return getMarioPattern();
  }
  if (trimmed === 'success') {
    return getSuccessPattern(defaultFrequency);
  }
  if (trimmed === 'error') {
    return getErrorPattern(defaultFrequency);
  }
  if (trimmed === 'warning') {
    return getWarningPattern(defaultFrequency);
  }
  
  // Check for short syntax (s-s-l, etc.)
  if (trimmed.includes('-') && !trimmed.includes(',')) {
    return parseShortSyntax(trimmed, defaultFrequency);
  }
  
  // Parse comma-separated durations
  return parseDurationList(trimmed, defaultFrequency);
}

/**
 * Parse short syntax like "s-s-l" (short-short-long)
 */
function parseShortSyntax(pattern: string, frequency: number): BeepNote[] {
  const parts = pattern.split('-');
  const notes: BeepNote[] = [];
  
  for (const part of parts) {
    const trimmed = part.trim();
    let duration = 200; // default short
    let pause = 50;
    
    if (trimmed === 's' || trimmed === 'short') {
      duration = 200;
    } else if (trimmed === 'm' || trimmed === 'medium') {
      duration = 300;
    } else if (trimmed === 'l' || trimmed === 'long') {
      duration = 500;
    } else {
      // Try to parse as number
      const num = parseInt(trimmed, 10);
      if (!isNaN(num)) {
        duration = num;
      }
    }
    
    notes.push({
      frequency,
      duration,
      pause,
    });
  }
  
  return notes;
}

/**
 * Parse comma-separated duration list
 */
function parseDurationList(pattern: string, frequency: number): BeepNote[] {
  const parts = pattern.split(',');
  const notes: BeepNote[] = [];
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    const duration = parseInt(part, 10);
    
    if (!isNaN(duration) && duration > 0) {
      notes.push({
        frequency,
        duration,
        pause: i < parts.length - 1 ? 50 : undefined, // pause between notes
      });
    }
  }
  
  return notes.length > 0 ? notes : [{ frequency, duration: 300 }];
}

/**
 * Get the Mario success pattern (ascending coin sound)
 */
function getMarioPattern(): BeepNote[] {
  return [
    { frequency: 659, duration: 100, pause: 50 },  // E5
    { frequency: 784, duration: 100, pause: 50 },  // G5
    { frequency: 988, duration: 150 },              // B5
  ];
}

/**
 * Get a simple success pattern
 */
function getSuccessPattern(frequency: number): BeepNote[] {
  return [
    { frequency, duration: 200, pause: 50 },
    { frequency: Math.floor(frequency * 1.2), duration: 200 },
  ];
}

/**
 * Get an error pattern (short-short-long)
 */
function getErrorPattern(frequency: number): BeepNote[] {
  return [
    { frequency, duration: 200, pause: 100 },
    { frequency, duration: 200, pause: 100 },
    { frequency, duration: 500 },
  ];
}

/**
 * Get a warning pattern
 */
function getWarningPattern(frequency: number): BeepNote[] {
  return [
    { frequency, duration: 300, pause: 100 },
    { frequency: Math.floor(frequency * 0.8), duration: 300 },
  ];
}
