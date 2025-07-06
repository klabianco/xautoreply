# X AutoReply Chrome Extension

A Chrome extension that automatically opens reply windows on X (formerly Twitter) using keyboard shortcuts.

## Features

- Automatically navigates to the next post and opens reply windows on X's For You Page (FYP)
- Uses keyboard shortcuts ('j' to navigate to next post, 'r' to open reply window)
- Toggle the extension on/off with Ctrl+Shift+A

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the extension directory
5. The extension is now installed!

## Usage

1. Go to X (twitter.com) and navigate to the For You Page
2. Press Ctrl+Shift+A to enable the auto-reply functionality
3. The extension will:
   - Press 'j' to navigate to the next post
   - Press 'r' to open the reply window
   - After you send a reply or close the window, it will automatically repeat
4. Press Ctrl+Shift+A again to disable the automation

## Configuration

You can modify the following settings in `content.js`:

- `delayBetweenActions`: Time to wait between automation cycles (default: 1000ms)
- `keyPressDelay`: Time to wait between keypresses (default: 200ms)

## Note

This extension is for educational purposes. Please use responsibly and in accordance with X's terms of service.
