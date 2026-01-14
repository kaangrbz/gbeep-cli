import { exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';

const execPromise = promisify(exec);

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
 * Generate a simple tone file for audio playback
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
 * Mac play command
 */
const macPlayCommand = (filePath: string, volume: number, rate: number): string => {
  return `afplay "${filePath}" -v ${volume} -r ${rate}`;
};

/**
 * Windows play command using PowerShell MediaPlayer
 */
const addPresentationCore = 'Add-Type -AssemblyName presentationCore;';
const createMediaPlayer = '$player = New-Object system.windows.media.mediaplayer;';
const loadAudioFile = (filePath: string): string => `$player.open('${filePath}');`;
const playAudio = '$player.Play();';
const windowPlayCommand = (filePath: string, volume: number, duration: number): string => {
  const durationMs = duration;
  const durationSec = (durationMs / 1000).toFixed(3);
  const waitCmd = `Start-Sleep -Milliseconds 100; $dur = $player.NaturalDuration.TimeSpan.TotalSeconds; if ($dur -gt 0) { Start-Sleep -Seconds $dur } else { Start-Sleep -Milliseconds ${durationMs} };`;
  return `powershell -c ${addPresentationCore} ${createMediaPlayer} ${loadAudioFile(filePath)} $player.Volume = ${volume}; ${playAudio} ${waitCmd} Exit;`;
};

/**
 * Play beep on Windows using PowerShell MediaPlayer
 */
async function playWindowsBeep(frequency: number, duration: number, verbose?: boolean): Promise<boolean> {
  try {
    const tempFile = generateToneFile(frequency, duration);
    if (!tempFile) return false;
    
    const volume = 0.5;
    const playCmd = windowPlayCommand(tempFile, volume, duration);
    
    await execPromise(playCmd, { windowsHide: true });
    
    // Clean up temp file
    try {
      fs.unlinkSync(tempFile);
    } catch {
      // Ignore cleanup errors
    }
    
    if (verbose) {
      console.error(`🔊 Windows: MediaPlayer (${frequency}Hz, ${duration}ms)`);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Play beep on macOS using afplay
 */
async function playMacOSBeep(frequency: number, duration: number, verbose?: boolean): Promise<boolean> {
  try {
    const tempFile = generateToneFile(frequency, duration);
    if (!tempFile) return false;
    
    const volume = 0.5;
    const rate = 1;
    const volumeAdjusted = Math.min(2, volume * 2); // Mac volume range 0-2
    const playCmd = macPlayCommand(tempFile, volumeAdjusted, rate);
    
    await execPromise(playCmd);
    
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
async function playLinuxBeep(frequency: number, duration: number, verbose?: boolean): Promise<boolean> {
  // Try speaker beep first (if available)
  try {
    const playCmd = `beep -f ${frequency} -l ${duration}`;
    await execPromise(playCmd);
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
async function playNativeBeep(frequency: number, duration: number, verbose?: boolean): Promise<boolean> {
  const osType = detectOS();
  
  switch (osType) {
    case 'windows':
      return await playWindowsBeep(frequency, duration, verbose);
    case 'macos':
      return await playMacOSBeep(frequency, duration, verbose);
    case 'linux':
      return await playLinuxBeep(frequency, duration, verbose);
    default:
      return playBell(verbose);
  }
}

/**
 * Play a beep sound
 */
export async function playBeep(options: SoundOptions): Promise<boolean> {
  const { frequency, duration, mode = 'auto', verbose } = options;
  
  try {
    const osType = detectOS();
    
    if (mode === 'bell') {
      // Bell mode: Linux için terminal bell, diğerleri için native
      if (osType === 'linux') {
        return playBell(verbose);
      }
      // Windows ve macOS için bell modunda bile native kullan
      return await playNativeBeep(frequency || 1200, duration || 300, verbose);
    }
    
    if (mode === 'native') {
      return await playNativeBeep(frequency, duration, verbose);
    }
    
    // auto mode: 
    // - Linux: Terminal bell önce, sonra native
    // - Windows/macOS: Direkt native (bell kullanılmaz)
    if (osType === 'linux') {
      // Linux için bell'i dene önce
      if (frequency === undefined || duration === undefined) {
        // Simple beep - try bell first
        if (playBell(verbose)) {
          return true;
        }
      }
      // Pattern veya bell başarısız - native'e geç
      return await playNativeBeep(frequency || 1200, duration || 300, verbose);
    } else {
      // Windows ve macOS: Direkt native kullan (bell yok)
      return await playNativeBeep(frequency || 1200, duration || 300, verbose);
    }
  } catch {
    // Fail silently - don't break the command
    return false;
  }
}
