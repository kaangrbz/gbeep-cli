import { execSync } from 'child_process';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';

export type SoundMode = 'auto' | 'bell' | 'native';

export interface SoundOptions {
  frequency: number;
  duration: number;
  mode?: SoundMode;
  verbose?: boolean;
}

/**
 * Detect the operating system
 */
export function detectOS(): 'windows' | 'macos' | 'linux' {
  const platform = os.platform();
  if (platform === 'win32') return 'windows';
  if (platform === 'darwin') return 'macos';
  return 'linux';
}

/**
 * Play a terminal bell
 */
function playBell(verbose?: boolean): boolean {
  try {
    process.stdout.write('\a');
    if (verbose) {
      console.error('🔔 Using terminal bell');
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Play beep on Windows using PowerShell Console.Beep
 */
function playWindowsBeep(frequency: number, duration: number, verbose?: boolean): boolean {
  try {
    const script = `[Console]::Beep(${frequency}, ${duration})`;
    execSync(`powershell -Command "${script}"`, { stdio: 'ignore' });
    if (verbose) {
      console.error(`🔊 Windows: Console.Beep(${frequency}Hz, ${duration}ms)`);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a simple tone file for macOS afplay
 */
function generateToneFile(frequency: number, duration: number): string | null {
  try {
    const tempDir = os.tmpdir();
    const tempFile = path.join(tempDir, `gbeep_${frequency}_${duration}.wav`);
    
    // Create a simple WAV file header and sine wave data
    // This is a minimal WAV file generator
    const sampleRate = 44100;
    const numSamples = Math.floor((sampleRate * duration) / 1000);
    const buffer = Buffer.alloc(44 + numSamples * 2); // WAV header + 16-bit samples
    
    // WAV header
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + numSamples * 2, 4);
    buffer.write('WAVE', 8);
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16); // fmt chunk size
    buffer.writeUInt16LE(1, 20); // audio format (PCM)
    buffer.writeUInt16LE(1, 22); // num channels
    buffer.writeUInt32LE(sampleRate, 24); // sample rate
    buffer.writeUInt32LE(sampleRate * 2, 28); // byte rate
    buffer.writeUInt16LE(2, 32); // block align
    buffer.writeUInt16LE(16, 34); // bits per sample
    buffer.write('data', 36);
    buffer.writeUInt32LE(numSamples * 2, 40);
    
    // Generate sine wave
    const amplitude = 0.3;
    for (let i = 0; i < numSamples; i++) {
      const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate);
      const intSample = Math.floor(sample * amplitude * 32767);
      buffer.writeInt16LE(intSample, 44 + i * 2);
    }
    
    fs.writeFileSync(tempFile, buffer);
    return tempFile;
  } catch {
    return null;
  }
}

/**
 * Play beep on macOS using afplay
 */
function playMacOSBeep(frequency: number, duration: number, verbose?: boolean): boolean {
  try {
    const tempFile = generateToneFile(frequency, duration);
    if (!tempFile) return false;
    
    execSync(`afplay "${tempFile}"`, { stdio: 'ignore' });
    
    // Clean up temp file
    try {
      fs.unlinkSync(tempFile);
    } catch {
      // Ignore cleanup errors
    }
    
    if (verbose) {
      console.error(`🔊 macOS: afplay (${frequency}Hz, ${duration}ms)`);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Play beep on Linux using terminal bell (or speaker beep if available)
 */
function playLinuxBeep(frequency: number, duration: number, verbose?: boolean): boolean {
  // Try speaker beep first (if available)
  try {
    execSync(`beep -f ${frequency} -l ${duration}`, { stdio: 'ignore' });
    if (verbose) {
      console.error(`🔊 Linux: beep command (${frequency}Hz, ${duration}ms)`);
    }
    return true;
  } catch {
    // Fallback to terminal bell
    return playBell(verbose);
  }
}

/**
 * Play a beep sound using the native OS method
 */
function playNativeBeep(frequency: number, duration: number, verbose?: boolean): boolean {
  const osType = detectOS();
  
  switch (osType) {
    case 'windows':
      return playWindowsBeep(frequency, duration, verbose);
    case 'macos':
      return playMacOSBeep(frequency, duration, verbose);
    case 'linux':
      return playLinuxBeep(frequency, duration, verbose);
    default:
      return playBell(verbose);
  }
}

/**
 * Play a beep sound
 */
export function playBeep(options: SoundOptions): boolean {
  const { frequency, duration, mode = 'auto', verbose } = options;
  
  try {
    if (mode === 'bell') {
      return playBell(verbose);
    }
    
    if (mode === 'native') {
      return playNativeBeep(frequency, duration, verbose);
    }
    
    // auto mode: try bell first, then native
    if (playBell(verbose)) {
      return true;
    }
    
    return playNativeBeep(frequency, duration, verbose);
  } catch {
    // Fail silently - don't break the command
    return false;
  }
}
