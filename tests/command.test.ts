import { executeCommand, CommandOptions } from '../src/command';

describe('command', () => {
  describe('executeCommand', () => {
    test('executes successful command', async () => {
      const options: CommandOptions = {
        command: process.platform === 'win32' ? 'cmd' : 'echo',
        args: process.platform === 'win32' ? ['/c', 'echo', 'test'] : ['test'],
      };
      
      const result = await executeCommand(options);
      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
    });

    test('executes failing command', async () => {
      const options: CommandOptions = {
        command: process.platform === 'win32' ? 'cmd' : 'false',
        args: process.platform === 'win32' ? ['/c', 'exit', '1'] : [],
      };
      
      const result = await executeCommand(options);
      expect(result.success).toBe(false);
      expect(result.exitCode).toBe(1);
    });

    test('handles invalid command gracefully', async () => {
      const options: CommandOptions = {
        command: 'nonexistent_command_xyz123',
        args: [],
      };
      
      const result = await executeCommand(options);
      expect(result.success).toBe(false);
      expect(result.exitCode).toBe(1);
    });

    test('handles verbose mode', async () => {
      const options: CommandOptions = {
        command: process.platform === 'win32' ? 'cmd' : 'echo',
        args: process.platform === 'win32' ? ['/c', 'echo', 'test'] : ['test'],
        verbose: true,
      };
      
      const result = await executeCommand(options);
      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
    });

    test('handles command with multiple args', async () => {
      const options: CommandOptions = {
        command: process.platform === 'win32' ? 'cmd' : 'echo',
        args: process.platform === 'win32' 
          ? ['/c', 'echo', 'hello', 'world'] 
          : ['hello', 'world'],
      };
      
      const result = await executeCommand(options);
      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
    });

    test('handles command with exit code 2', async () => {
      const options: CommandOptions = {
        command: process.platform === 'win32' ? 'cmd' : 'sh',
        args: process.platform === 'win32' 
          ? ['/c', 'exit', '2'] 
          : ['-c', 'exit 2'],
      };
      
      const result = await executeCommand(options);
      expect(result.success).toBe(false);
      expect(result.exitCode).toBe(2);
    });

    test('handles empty args array', async () => {
      // On Windows, cmd without args hangs, so use a command that exits immediately
      const options: CommandOptions = {
        command: process.platform === 'win32' ? 'cmd' : 'echo',
        args: process.platform === 'win32' ? ['/c', 'exit', '0'] : [],
      };
      
      // Should still execute, though behavior may vary
      const result = await executeCommand(options);
      expect(result).toHaveProperty('exitCode');
      expect(result).toHaveProperty('success');
    });

    test('handles command with special characters in args', async () => {
      const options: CommandOptions = {
        command: process.platform === 'win32' ? 'cmd' : 'echo',
        args: process.platform === 'win32' 
          ? ['/c', 'echo', 'test&test'] 
          : ['test&test'],
      };
      
      const result = await executeCommand(options);
      expect(result).toHaveProperty('exitCode');
      expect(result).toHaveProperty('success');
    });
  });
});
