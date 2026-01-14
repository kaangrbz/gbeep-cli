import { spawn, ChildProcess } from 'child_process';

export interface CommandOptions {
  command: string;
  args: string[];
  verbose?: boolean;
}

export interface CommandResult {
  exitCode: number;
  success: boolean;
}

/**
 * Execute a command and return its exit code
 */
export async function executeCommand(options: CommandOptions): Promise<CommandResult> {
  const { command, args, verbose } = options;
  
  if (verbose) {
    console.error(`▶ Running: ${command} ${args.join(' ')}`);
  }
  
  return new Promise((resolve) => {
    const child: ChildProcess = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    
    child.on('error', (error) => {
      if (verbose) {
        console.error(`✗ Command error: ${error.message}`);
      }
      resolve({ exitCode: 1, success: false });
    });
    
    child.on('exit', (code) => {
      const exitCode = code ?? 1;
      const success = exitCode === 0;
      
      if (verbose) {
        console.error(`✓ Command exited with code: ${exitCode}`);
      }
      
      resolve({ exitCode, success });
    });
  });
}
