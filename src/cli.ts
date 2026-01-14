import { Command } from 'commander';
import { executeCommand, CommandResult } from './command';
import { playBeepWithConfig, BeepConfig } from './beep';
import { detectOS } from './sound';

/**
 * Show help message with examples
 */
function showHelp(program: Command) {
  program
    .name('beep')
    .description('A tiny, cross-platform CLI that plays a sound when a command finishes or on demand')
    .version('1.0.0')
    .option('-f, --frequency <hz>', 'Beep frequency', '1200')
    .option('-d, --duration <ms>', 'Beep duration in milliseconds', '300')
    .option('-s, --sound <mode>', 'Sound mode: auto | bell | native', 'auto')
    .option('--success', 'Beep only on successful exit')
    .option('--error', 'Beep only on error exit')
    .option('--silent', 'Suppress all output (sound only)')
    .option('--pattern <pattern>', 'Beep pattern (e.g., "s-s-l", "mario", "200,100,400")')
    .option('-r, --repeat <n>', 'Repeat beep N times', '1')
    .option('--delay <ms>', 'Delay before beep in milliseconds', '0')
    .option('-v, --verbose', 'Show verbose output')
    .option('--success-freq <hz>', 'Frequency for success beep')
    .option('--success-duration <ms>', 'Duration for success beep')
    .option('--error-freq <hz>', 'Frequency for error beep')
    .option('--error-duration <ms>', 'Duration for error beep')
    .addHelpText('after', `
Examples:
  $ beep                          # Play default beep
  $ beep 800 200                  # Play 800Hz, 200ms beep
  $ beep -f 1000 -d 500           # Play 1000Hz, 500ms beep
  $ beep --pattern mario          # Play Mario pattern
  $ beep --pattern "s-s-l"        # Play short-short-long pattern
  $ beep -r 3                     # Repeat beep 3 times
  $ beep --delay 1000             # Wait 1 second, then play beep
  $ beep -- -- npm test           # Run npm test, play beep when done
  $ beep --success -- -- yarn build  # Play beep only if build succeeds
  $ beep --error -- -- yarn test      # Play beep only if test fails
  $ beep -v --pattern mario -- -- ls  # Run command in verbose mode

For more information: https://github.com/kaangrbz/gbeep-cli
    `);
  
  program.outputHelp();
}

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
  
  // Check for help and version - check these first
  if (args.includes('--help') || args.includes('-h')) {
    showHelp(program);
    return 0;
  }
  
  if (args.includes('--version') || args.includes('-V')) {
    console.log('1.0.0');
    return 0;
  }
  
  // Add exitOverride to catch errors
  program.exitOverride();
  
  program
    .name('beep')
    .description('A tiny, cross-platform CLI that plays a sound when a command finishes or on demand')
    .version('1.0.0')
    .option('-f, --frequency <hz>', 'Beep frequency', (v: string) => {
      const num = parseInt(v, 10);
      if (isNaN(num) || num <= 0) {
        throw new Error('Frequency must be a positive number.');
      }
      return num;
    }, 1200)
    .option('-d, --duration <ms>', 'Beep duration in milliseconds', (v: string) => {
      const num = parseInt(v, 10);
      if (isNaN(num) || num <= 0) {
        throw new Error('Duration must be a positive number.');
      }
      return num;
    }, 300)
    .option('-s, --sound <mode>', 'Sound mode: auto | bell | native', (v: string) => {
      if (!['auto', 'bell', 'native'].includes(v)) {
        throw new Error('Sound mode must be "auto", "bell", or "native".');
      }
      return v;
    }, 'auto')
    .option('--success', 'Beep only on successful exit')
    .option('--error', 'Beep only on error exit')
    .option('--silent', 'Suppress all output (sound only)')
    .option('--pattern <pattern>', 'Beep pattern (e.g., "s-s-l", "mario", "200,100,400")')
    .option('-r, --repeat <n>', 'Repeat beep N times', (v: string) => {
      const num = parseInt(v, 10);
      if (isNaN(num) || num <= 0) {
        throw new Error('Repeat must be a positive number.');
      }
      return num;
    }, 1)
    .option('--delay <ms>', 'Delay before beep in milliseconds', (v: string) => {
      const num = parseInt(v, 10);
      if (isNaN(num) || num < 0) {
        throw new Error('Delay cannot be negative.');
      }
      return num;
    }, 0)
    .option('-v, --verbose', 'Show verbose output')
    .option('--success-freq <hz>', 'Frequency for success beep', (v: string) => {
      const num = parseInt(v, 10);
      if (isNaN(num) || num <= 0) {
        throw new Error('Success frequency must be a positive number.');
      }
      return num;
    })
    .option('--success-duration <ms>', 'Duration for success beep', (v: string) => {
      const num = parseInt(v, 10);
      if (isNaN(num) || num <= 0) {
        throw new Error('Success duration must be a positive number.');
      }
      return num;
    })
    .option('--error-freq <hz>', 'Frequency for error beep', (v: string) => {
      const num = parseInt(v, 10);
      if (isNaN(num) || num <= 0) {
        throw new Error('Error frequency must be a positive number.');
      }
      return num;
    })
    .option('--error-duration <ms>', 'Duration for error beep', (v: string) => {
      const num = parseInt(v, 10);
      if (isNaN(num) || num <= 0) {
        throw new Error('Error duration must be a positive number.');
      }
      return num;
    })
    .addHelpText('after', `
Örnek Kullanımlar:
  $ beep                          # Varsayılan beep çal
  $ beep 800 200                  # 800Hz, 200ms beep çal
  $ beep -f 1000 -d 500           # 1000Hz, 500ms beep çal
  $ beep --pattern mario          # Mario pattern çal
  $ beep --pattern "s-s-l"        # Kısa-kısa-uzun pattern
  $ beep -r 3                     # Beep'i 3 kez tekrarla
  $ beep --delay 1000             # 1 saniye bekle, sonra beep çal
  $ beep -- -- npm test           # npm test çalıştır, bitince beep çal
  $ beep --success -- -- yarn build  # Build başarılı olursa beep çal
  $ beep --error -- -- yarn test      # Test hata verirse beep çal
  $ beep -v --pattern mario -- -- ls  # Verbose modda komut çalıştır

Daha fazla bilgi için: https://github.com/yourusername/gbeep
    `);
  
  // Parse args - parse without allowUnknownOption for command arguments
  try {
    program.parse(args, { from: 'node' });
  } catch (err: any) {
    // Unknown option error
    if (err.code === 'commander.unknownOption') {
      console.error(`❌ Error: Unknown option: ${err.message}`);
      console.error('💡 For help: beep --help or beep -h');
      return 1;
    }
    // Validation errors (numeric values, invalid modes, etc.)
    if (err.message) {
      console.error(`❌ Error: ${err.message}`);
      console.error('💡 For help: beep --help or beep -h');
      return 1;
    }
    // Unexpected errors
    console.error(`❌ Unexpected error: ${err}`);
    console.error('💡 For help: beep --help or beep -h');
    return 1;
  }
  
  let options = program.opts() as CLIOptions;
  const remaining = program.args;
  
  // Manual pattern parse (Commander.js might have issues)
  const patternIndex = args.indexOf('--pattern');
  if (patternIndex !== -1 && patternIndex + 1 < args.length) {
    options.pattern = args[patternIndex + 1];
  }
  
  // Debug: pattern değerini kontrol et
  if (process.env.DEBUG) {
    console.error('DEBUG: options.pattern =', options.pattern);
    console.error('DEBUG: all options =', JSON.stringify(options, null, 2));
  }
  
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
        console.error('❌ Error: No command specified after "--".');
        console.error('💡 Example: beep -- npm test');
        console.error('💡 For help: beep --help or beep -h');
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
      if ((options.repeat || 1) > 1) {
        console.error(`🔁 Repeat: ${options.repeat || 1}x`);
      }
      if ((options.delay || 0) > 0) {
        console.error(`⏳ Delay: ${options.delay || 0}ms`);
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
        repeat: options.repeat || 1,
        delay: options.delay || 0,
        soundMode: options.sound as 'auto' | 'bell' | 'native',
        verbose: options.verbose && !options.silent,
      };
      
      // Auto-apply Mario pattern for success if no pattern specified
      if (result.success && options.success && !options.pattern) {
        beepConfig.pattern = 'mario';
      }
      
      // Apply success/error specific settings
      if (result.success && (options.successFreq || options.successDuration)) {
        beepConfig.frequency = options.successFreq || frequency;
        beepConfig.duration = options.successDuration || duration;
      }
      
      if (!result.success && (options.errorFreq || options.errorDuration)) {
        beepConfig.frequency = options.errorFreq || frequency;
        beepConfig.duration = options.errorDuration || duration;
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
      if ((options.repeat || 1) > 1) {
        console.error(`🔁 Repeat: ${options.repeat || 1}x`);
      }
      if ((options.delay || 0) > 0) {
        console.error(`⏳ Delay: ${options.delay || 0}ms`);
      }
    }
    
    const beepConfig: BeepConfig = {
      frequency,
      duration,
      pattern: options.pattern,
      repeat: options.repeat ?? 1,
      delay: options.delay ?? 0,
      soundMode: options.sound as 'auto' | 'bell' | 'native',
      verbose: options.verbose && !options.silent,
    };
    
    await playBeepWithConfig(beepConfig);
    return 0;
  }
}
