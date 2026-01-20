# gbeep — global terminal beep CLI

gbeep is a tiny, cross-platform CLI that plays a sound when a command finishes or on demand.
It's built for long-running builds, scripts, and tasks where you stop staring at the terminal but still want instant feedback.

**No config. No daemon. One command, one sound.**

## Requirements

- Node.js >= 14.0.0

## Installation

```bash
yarn global add gbeep
```

## Usage

```bash
beep [options] [--] <command>
```

Or standalone:

```bash
beep [options]
```

## Examples

```bash
beep
```

Plays a default beep (1200Hz, 300ms).

```bash
beep 800 200
```

Shortcut for frequency + duration.

```bash
beep -- npm run build
```

Runs a command and beeps when it finishes.

```bash
beep --success -- npm test
```

Beeps only if the command exits with code 0 (plays Mario success pattern by default).

```bash
beep --error -- npm run build
```

Beeps only if the command fails.

```bash
beep --pattern mario
```

Plays the Mario success pattern.

```bash
beep --pattern "s-s-l" --repeat 3
```

Plays a short-short-long pattern 3 times.

```bash
beep --delay 500 -- npm run build
```

Waits 500ms after command completion before beeping.

```bash
beep --success --success-freq 800 --error --error-freq 400 -- npm test
```

Uses different frequencies for success vs error.

```bash
beep --sound native
```

Uses the OS-native sound method.

```bash
beep --verbose -- npm test
```

Shows detailed information about sound method and execution.

## Options

- `-f, --frequency <hz>`     Beep frequency (default: 1200)
- `-d, --duration <ms>`      Beep duration in milliseconds (default: 300)
- `-s, --sound <mode>`       `auto` | `bell` | `native` (default: `auto`)
- `-p, --pattern <pattern>`  Beep pattern (e.g., `"s-s-l"`, `"mario"`, `"200,100,400"`)
- `-r, --repeat <n>`         Repeat beep N times
- `--delay <ms>`             Delay before beep in milliseconds
- `--success`                Beep only on successful exit (auto-uses Mario pattern)
- `--error`                  Beep only on error exit
- `--success-freq <hz>`      Frequency for success beep
- `--success-duration <ms>`  Duration for success beep
- `--error-freq <hz>`        Frequency for error beep
- `--error-duration <ms>`    Duration for error beep
- `--silent`                 Suppress all output (sound only)
- `-v, --verbose`            Show verbose output
- `-h, --help`               Show help

## Sound Modes

### `auto`
Uses the best available method per OS.

- **Windows**: PowerShell MediaPlayer with generated WAV file (terminal bell not used)
- **macOS**: `afplay` with generated WAV file (terminal bell not used)
- **Linux**: Terminal bell first, then `beep` command if available

### `bell`
Platform-specific behavior:

- **Linux**: Forces terminal bell (`\a`)
- **Windows**: Uses PowerShell MediaPlayer (instead of terminal bell)
- **macOS**: Uses `afplay` (instead of terminal bell)

### `native`
Uses OS-specific sound methods:

- **Windows**: PowerShell MediaPlayer with generated WAV file
- **macOS**: `afplay` with generated WAV file
- **Linux**: `beep` command or terminal bell fallback

## Beep Patterns

### Pattern Syntax

- **Comma-separated durations**: `"200,100,200,100,400"` (durations in ms)
- **Short syntax**: `"s-s-l"` (short-short-long)
- **Preset names**: `mario`, `success`, `error`, `warning`

### Preset Patterns

- **`mario`**: Classic Super Mario Bros coin/power-up sound (659Hz → 784Hz → 988Hz)
- **`success`**: Two ascending beeps
- **`error`**: Short-short-long pattern
- **`warning`**: Two descending beeps

### Examples

```bash
beep --pattern "s-s-l"        # Short-short-long
beep --pattern "200,100,400"   # Custom durations
beep --pattern mario           # Mario success pattern
beep --success --pattern mario # Explicit Mario pattern
```

When `--success` is used without an explicit pattern, the Mario pattern is automatically used.

## Platform Support

- ✅ **Windows** (PowerShell, CMD, Windows Terminal) - Uses PowerShell MediaPlayer, terminal bell not used
- ✅ **macOS** (Terminal, iTerm2) - Uses `afplay`, terminal bell not used
- ✅ **Linux** (most terminals) - Uses terminal bell or `beep` command
- ✅ **CI / headless environments** (no errors, silent exit)
- ✅ **Node.js** >= 14.0.0

If sound is unavailable or muted, gbeep exits cleanly without failing the command.

## Design Principles

- ✅ Zero configuration
- ✅ No shell hooks
- ✅ No background processes
- ✅ Cross-platform by default
- ✅ Predictable exit behavior

## Why gbeep?

Because your eyes wander, but your ears stay alert.
