import { Command } from 'commander';
import { executeCommand, CommandResult } from './command';
import { playBeepWithConfig, BeepConfig } from './beep';
import { detectOS } from './sound';

export interface CLIOptions {
  frequency?: number;
  duration?: number;
  sound?: 'auto' | 'bell' | 'native';
  success?: boolean;
  error?: boolean;
  silent?: boolean;
  pattern?: string;
  repeat?: number;
  delay?: number;
  verbose?: boolean;
  successFreq?: number;
  successDuration?: number;
  errorFreq?: number;
  errorDuration?: number;
  command?: string[];
}

/**
 * Parse CLI arguments and execute
 */
export async function parseAndExecute(args: string[]): Promise<number> {
  const program = new Command();
  
  program
    .name('beep')
    .description('A tiny, cross-platform CLI that plays a sound when a command finishes or on demand')
    .version('1.0.0')
    .option('-f, --frequency <hz>', 'Beep frequency', (v: string) => parseInt(v, 10), 1200)
    .option('-d, --duration <ms>', 'Beep duration in milliseconds', (v: string) => parseInt(v, 10), 300)
    .option('-s, --sound <mode>', 'Sound mode: auto | bell | native', 'auto')
    .option('--success', 'Beep only on successful exit')
    .option('--error', 'Beep only on error exit')
    .option('--silent', 'Suppress all output (sound only)')
    .option('-p, --pattern <pattern>', 'Beep pattern (e.g., "s-s-l", "mario", "200,100,400")')
    .option('-r, --repeat <n>', 'Repeat beep N times', (v: string) => parseInt(v, 10), 1)
    .option('--delay <ms>', 'Delay before beep in milliseconds', (v: string) => parseInt(v, 10), 0)
    .option('-v, --verbose', 'Show verbose output')
    .option('--success-freq <hz>', 'Frequency for success beep', (v: string) => parseInt(v, 10))
    .option('--success-duration <ms>', 'Duration for success beep', (v: string) => parseInt(v, 10))
    .option('--error-freq <hz>', 'Frequency for error beep', (v: string) => parseInt(v, 10))
    .option('--error-duration <ms>', 'Duration for error beep', (v: string) => parseInt(v, 10))
    .allowUnknownOption()
    .parse(args);
  
  const options = program.opts() as CLIOptions;
  const remaining = program.args;
  
  // Handle positional arguments (frequency duration shortcut)
  let frequency = options.frequency;
  let duration = options.duration;
  let commandStartIndex = 0;
  
  // Check for positional frequency/duration at the start
  if (remaining.length >= 2 && !isNaN(parseInt(remaining[0], 10)) && !isNaN(parseInt(remaining[1], 10))) {
    // Positional args: beep 800 200
    frequency = parseInt(remaining[0], 10);
    duration = parseInt(remaining[1], 10);
    commandStartIndex = 2;
  }
  
  // Determine if we're executing a command (look for -- separator or remaining args that look like commands)
  const commandIndex = args.indexOf('--');
  const hasCommand = commandIndex !== -1 || (remaining.length > commandStartIndex);
  
  if (hasCommand) {
    // Execute command mode
    let commandArgs: string[] = [];
    
    if (commandIndex !== -1) {
      commandArgs = args.slice(commandIndex + 1);
    } else {
      // No -- separator, use remaining args after positional args
      commandArgs = remaining.slice(commandStartIndex);
    }
    
    if (commandArgs.length === 0) {
      if (!options.silent) {
        console.error('Error: No command specified after --');
      }
      return 1;
    }
    
    const [command, ...cmdArgs] = commandArgs;
    
    // Show verbose info
    if (options.verbose && !options.silent) {
      const os = detectOS();
      console.error(`🖥️  OS: ${os}`);
      console.error(`🔊 Sound mode: ${options.sound}`);
      if (options.pattern) {
        console.error(`🎵 Pattern: ${options.pattern}`);
      }
      if (options.repeat > 1) {
        console.error(`🔁 Repeat: ${options.repeat}x`);
      }
      if (options.delay > 0) {
        console.error(`⏳ Delay: ${options.delay}ms`);
      }
    }
    
    // Execute the command
    const result: CommandResult = await executeCommand({
      command,
      args: cmdArgs,
      verbose: options.verbose && !options.silent,
    });
    
    // Determine if we should beep
    let shouldBeep = true;
    
    if (options.success && !result.success) {
      shouldBeep = false;
    }
    if (options.error && result.success) {
      shouldBeep = false;
    }
    
    if (shouldBeep) {
      // Determine beep config based on success/error
      let beepConfig: BeepConfig = {
        frequency,
        duration,
        pattern: options.pattern,
        repeat: options.repeat,
        delay: options.delay,
        soundMode: options.sound as 'auto' | 'bell' | 'native',
        verbose: options.verbose && !options.silent,
      };
      
      // Auto-apply Mario pattern for success if no pattern specified
      if (result.success && options.success && !options.pattern) {
        beepConfig.pattern = 'mario';
      }
      
      // Apply success/error specific settings
      if (result.success && (options.successFreq || options.successDuration)) {
        beepConfig.frequency = options.successFreq ?? frequency;
        beepConfig.duration = options.successDuration ?? duration;
      }
      
      if (!result.success && (options.errorFreq || options.errorDuration)) {
        beepConfig.frequency = options.errorFreq ?? frequency;
        beepConfig.duration = options.errorDuration ?? duration;
      }
      
      await playBeepWithConfig(beepConfig);
    }
    
    return result.exitCode;
  } else {
    // Standalone beep mode
    if (options.verbose && !options.silent) {
      const os = detectOS();
      console.error(`🖥️  OS: ${os}`);
      console.error(`🔊 Sound mode: ${options.sound}`);
      if (options.pattern) {
        console.error(`🎵 Pattern: ${options.pattern}`);
      }
      if (options.repeat > 1) {
        console.error(`🔁 Repeat: ${options.repeat}x`);
      }
      if (options.delay > 0) {
        console.error(`⏳ Delay: ${options.delay}ms`);
      }
    }
    
    const beepConfig: BeepConfig = {
      frequency,
      duration,
      pattern: options.pattern,
      repeat: options.repeat,
      delay: options.delay,
      soundMode: options.sound as 'auto' | 'bell' | 'native',
      verbose: options.verbose && !options.silent,
    };
    
    await playBeepWithConfig(beepConfig);
    return 0;
  }
}
