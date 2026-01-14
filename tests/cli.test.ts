import { parseAndExecute } from '../src/cli';

describe('cli', () => {
  describe('parseAndExecute', () => {
    test('handles standalone beep', async () => {
      const exitCode = await parseAndExecute([]);
      expect(exitCode).toBe(0);
    });

    test('handles frequency and duration positional args', async () => {
      const exitCode = await parseAndExecute(['800', '200']);
      expect(exitCode).toBe(0);
    });

    test('handles frequency option', async () => {
      const exitCode = await parseAndExecute(['--frequency', '1000']);
      expect(exitCode).toBe(0);
    });

    test('handles duration option', async () => {
      const exitCode = await parseAndExecute(['--duration', '500']);
      expect(exitCode).toBe(0);
    });

    test('handles pattern option', async () => {
      const exitCode = await parseAndExecute(['--pattern', 'mario']);
      expect(exitCode).toBe(0);
    });

    test('handles repeat option', async () => {
      const exitCode = await parseAndExecute(['--repeat', '2']);
      expect(exitCode).toBe(0);
    });

    test('handles delay option', async () => {
      const exitCode = await parseAndExecute(['--delay', '10']);
      expect(exitCode).toBe(0);
    });

    test('handles sound mode option', async () => {
      const modes = ['auto', 'bell', 'native'];
      
      for (const mode of modes) {
        const exitCode = await parseAndExecute(['--sound', mode]);
        expect(exitCode).toBe(0);
      }
    });

    test('handles verbose option', async () => {
      const exitCode = await parseAndExecute(['--verbose']);
      expect(exitCode).toBe(0);
    });

    test('handles silent option', async () => {
      const exitCode = await parseAndExecute(['--silent']);
      expect(exitCode).toBe(0);
    });

    test('handles short options', async () => {
      const exitCode = await parseAndExecute(['-f', '1000', '-d', '500']);
      expect(exitCode).toBe(0);
    });

    test('handles command execution with success', async () => {
      const command = process.platform === 'win32' 
        ? ['--', 'cmd', '/c', 'echo', 'test']
        : ['--', 'echo', 'test'];
      
      const exitCode = await parseAndExecute(command);
      expect(exitCode).toBe(0);
    });

    test('handles command execution with failure', async () => {
      const command = process.platform === 'win32'
        ? ['--', 'cmd', '/c', 'exit', '1']
        : ['--', 'false'];
      
      const exitCode = await parseAndExecute(command);
      expect(exitCode).toBe(1);
    });

    test('handles --success flag with successful command', async () => {
      const command = process.platform === 'win32'
        ? ['--success', '--', 'cmd', '/c', 'echo', 'test']
        : ['--success', '--', 'echo', 'test'];
      
      const exitCode = await parseAndExecute(command);
      expect(exitCode).toBe(0);
    });

    test('handles --success flag with failing command', async () => {
      const command = process.platform === 'win32'
        ? ['--success', '--', 'cmd', '/c', 'exit', '1']
        : ['--success', '--', 'false'];
      
      const exitCode = await parseAndExecute(command);
      expect(exitCode).toBe(1);
    });

    test('handles --error flag with failing command', async () => {
      const command = process.platform === 'win32'
        ? ['--error', '--', 'cmd', '/c', 'exit', '1']
        : ['--error', '--', 'false'];
      
      const exitCode = await parseAndExecute(command);
      expect(exitCode).toBe(1);
    });

    test('handles --error flag with successful command', async () => {
      const command = process.platform === 'win32'
        ? ['--error', '--', 'cmd', '/c', 'echo', 'test']
        : ['--error', '--', 'echo', 'test'];
      
      const exitCode = await parseAndExecute(command);
      expect(exitCode).toBe(0);
    });

    test('handles success-freq option', async () => {
      const command = process.platform === 'win32'
        ? ['--success', '--success-freq', '800', '--', 'cmd', '/c', 'echo', 'test']
        : ['--success', '--success-freq', '800', '--', 'echo', 'test'];
      
      const exitCode = await parseAndExecute(command);
      expect(exitCode).toBe(0);
    });

    test('handles success-duration option', async () => {
      const command = process.platform === 'win32'
        ? ['--success', '--success-duration', '500', '--', 'cmd', '/c', 'echo', 'test']
        : ['--success', '--success-duration', '500', '--', 'echo', 'test'];
      
      const exitCode = await parseAndExecute(command);
      expect(exitCode).toBe(0);
    });

    test('handles error-freq option', async () => {
      const command = process.platform === 'win32'
        ? ['--error', '--error-freq', '400', '--', 'cmd', '/c', 'exit', '1']
        : ['--error', '--error-freq', '400', '--', 'false'];
      
      const exitCode = await parseAndExecute(command);
      expect(exitCode).toBe(1);
    });

    test('handles error-duration option', async () => {
      const command = process.platform === 'win32'
        ? ['--error', '--error-duration', '500', '--', 'cmd', '/c', 'exit', '1']
        : ['--error', '--error-duration', '500', '--', 'false'];
      
      const exitCode = await parseAndExecute(command);
      expect(exitCode).toBe(1);
    });

    test('handles combination of options', async () => {
      const exitCode = await parseAndExecute([
        '--frequency', '1000',
        '--duration', '500',
        '--pattern', 'mario',
        '--repeat', '2',
        '--delay', '10',
        '--verbose'
      ]);
      expect(exitCode).toBe(0);
    });

    test('handles command with all options', async () => {
      const command = process.platform === 'win32'
        ? [
            '--success',
            '--success-freq', '800',
            '--error',
            '--error-freq', '400',
            '--verbose',
            '--', 'cmd', '/c', 'echo', 'test'
          ]
        : [
            '--success',
            '--success-freq', '800',
            '--error',
            '--error-freq', '400',
            '--verbose',
            '--', 'echo', 'test'
          ];
      
      const exitCode = await parseAndExecute(command);
      expect(exitCode).toBe(0);
    });

    test('handles empty command after --', async () => {
      const exitCode = await parseAndExecute(['--']);
      expect(exitCode).toBe(1);
    });

    test('handles positional args with command', async () => {
      const command = process.platform === 'win32'
        ? ['800', '200', '--', 'cmd', '/c', 'echo', 'test']
        : ['800', '200', '--', 'echo', 'test'];
      
      const exitCode = await parseAndExecute(command);
      expect(exitCode).toBe(0);
    });

    test('handles pattern with command', async () => {
      const command = process.platform === 'win32'
        ? ['--pattern', 'mario', '--', 'cmd', '/c', 'echo', 'test']
        : ['--pattern', 'mario', '--', 'echo', 'test'];
      
      const exitCode = await parseAndExecute(command);
      expect(exitCode).toBe(0);
    });

    test('handles silent mode with command', async () => {
      const command = process.platform === 'win32'
        ? ['--silent', '--', 'cmd', '/c', 'echo', 'test']
        : ['--silent', '--', 'echo', 'test'];
      
      const exitCode = await parseAndExecute(command);
      expect(exitCode).toBe(0);
    });
  });
});
