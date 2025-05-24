import { logger } from '../utils/logger';
import fetch from 'node-fetch';
import os from 'os';
import path from 'path';

export class ChromeService {
  private debuggingPort: number = 9222;

  public async startChrome(): Promise<void> {
    try {
      logger.info('Checking Chrome connection...');
      await this.waitForChromeStart();
      logger.info('Chrome is running and ready');
    } catch (error) {
      const username = os.userInfo().username;
      logger.info('To start Chrome with debugging enabled:');
      logger.info('1. Close all Chrome windows');
      logger.info('2. Open Command Prompt (cmd.exe)');
      logger.info('3. Copy and paste this exact command:');
      logger.info(`start chrome.exe --remote-debugging-port=9222 --user-data-dir="C:\\Users\\${username}\\AppData\\Local\\Google\\Chrome\\User Data\\Default"`);
      logger.error('4. Press Enter to run the command');
      logger.error('5. Wait for Chrome to open');
      logger.error('6. Go to https://sora.chatgpt.com/explore');
      throw new Error('Chrome not connected');
    }
  }

  private async waitForChromeStart(): Promise<void> {
    const maxAttempts = 5;
    const delay = 2000;

    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await fetch(`http://localhost:${this.debuggingPort}/json/version`);
        if (response.ok) {
          const data = await response.json();
          if (data.webSocketDebuggerUrl) {
            return;
          }
        }
      } catch (error) {
        // Ignore connection errors
      }
      
      if (i < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('Chrome not connected');
  }

  public async stopChrome(): Promise<void> {
    logger.info('Chrome connection closed');
  }
} 