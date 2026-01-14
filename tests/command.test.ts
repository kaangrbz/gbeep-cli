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
  });
});
