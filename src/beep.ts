import { playBeep, SoundOptions } from './sound';
import { BeepNote, parsePattern } from './patterns';

export interface BeepConfig {
  frequency?: number;
  duration?: number;
  pattern?: string;
  repeat?: number;
  delay?: number;
  soundMode?: 'auto' | 'bell' | 'native';
  verbose?: boolean;
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Play a single beep note
 */
async function playNote(note: BeepNote, soundMode: 'auto' | 'bell' | 'native', verbose?: boolean): Promise<void> {
  const options: SoundOptions = {
    frequency: note.frequency,
    duration: note.duration,
    mode: soundMode,
    verbose,
  };
  
  playBeep(options);
  
  if (note.pause) {
    await sleep(note.pause);
  }
}

/**
 * Play a beep pattern
 */
async function playPattern(
  pattern: string,
  defaultFrequency: number,
  soundMode: 'auto' | 'bell' | 'native',
  verbose?: boolean
): Promise<void> {
  const notes = parsePattern(pattern, defaultFrequency);
  
  if (verbose) {
    console.error(`🎵 Playing pattern: ${pattern}`);
    console.error(`   Notes: ${notes.length}`);
  }
  
  for (const note of notes) {
    await playNote(note, soundMode, verbose);
  }
}

/**
 * Play a beep based on configuration
 */
export async function playBeepWithConfig(config: BeepConfig): Promise<void> {
  const {
    frequency = 1200,
    duration = 300,
    pattern,
    repeat = 1,
    delay = 0,
    soundMode = 'auto',
    verbose,
  } = config;
  
  // Apply delay if specified
  if (delay > 0) {
    if (verbose) {
      console.error(`⏳ Waiting ${delay}ms before beep...`);
    }
    await sleep(delay);
  }
  
  // Play the beep(s)
  for (let i = 0; i < repeat; i++) {
    if (repeat > 1 && verbose) {
      console.error(`🔊 Beep ${i + 1}/${repeat}`);
    }
    
    if (pattern) {
      await playPattern(pattern, frequency, soundMode, verbose);
    } else {
      const options: SoundOptions = {
        frequency,
        duration,
        mode: soundMode,
        verbose: verbose && i === 0, // Only verbose on first beep
      };
      playBeep(options);
    }
    
    // Pause between repeats (except after last)
    if (i < repeat - 1) {
      await sleep(200);
    }
  }
}
