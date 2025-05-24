import { BrowserService } from './services/browser.service';
import { ChromeService } from './services/chrome.service';
import { ConfigService } from './config/config.service';
import { logger } from './utils/logger';
import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function runMultiStyleGeneration(browserService: BrowserService, page: any) {
  const configService = ConfigService.getInstance();
  const prompts = configService.getPromptStrings();
  
  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    logger.info(`Processing prompt ${i + 1} of ${prompts.length}`);
    
    try {
      // Wait for any ongoing generation to complete
      while (await browserService.isGenerating(page)) {
        logger.info("Waiting for previous generation to complete...");
        await page.waitForTimeout(5000);
      }

      // Focus textarea before entering prompt
      await browserService.focusTextarea(page);

      // Use the prompt
      await page.fill('textarea', prompt);
      logger.info(`Entered prompt ${i + 1}`);

      // Click enter button and wait for generation
      const success = await browserService.clickEnterButton(page);
      if (!success) {
        logger.error(`Failed to click enter button for prompt ${i + 1}`);
        continue;
      }

      await browserService.waitForGeneration(page);
      logger.info(`Successfully generated images for prompt ${i + 1}`);

      // Add a delay between generations
      await page.waitForTimeout(5000);
    } catch (error) {
      logger.error(`Error processing prompt ${i + 1}:`, error);
    }
  }
}

async function runSingleStyleGeneration(browserService: BrowserService, page: any) {
  const configService = ConfigService.getInstance();
  const items = configService.getItems();
  
  for (const item of items) {
    logger.info(`Processing: ${item.name}`);
    try {
      // Focus textarea and enter prompt first
      await browserService.focusTextarea(page);
      const prompt = configService.generatePrompt(item);
      await page.fill('textarea', prompt);
      logger.info("Entered prompt");

      // Then check if generation is in progress
      while (await browserService.isGenerating(page)) {
        logger.info("Waiting for previous generation to complete...");
        await page.waitForTimeout(5000);
      }

      // Click enter button and wait for generation
      const success = await browserService.clickEnterButton(page);
      if (!success) {
        logger.error(`Failed to click enter button for ${item.name}`);
        continue;
      }

      await browserService.waitForGeneration(page);
      logger.info(`Successfully generated images for ${item.name}`);

      // Add a delay between generations
      await page.waitForTimeout(5000);
    } catch (error) {
      logger.error(`Error processing ${item.name}:`, error);
    }
  }
}

async function main() {
  try {
    // Ask user for generation type
    console.log('\nSelect generation type:');
    console.log('1. Multi-image with same style (using items list)');
    console.log('2. Multi-image with different styles (using prompts list)');
    
    const answer = await askQuestion('\nEnter your choice (1 or 2): ');
    
    if (answer !== '1' && answer !== '2') {
      console.log('Invalid choice. Please run the script again and select 1 or 2.');
      rl.close();
      return;
    }

    const browserService = new BrowserService();
    const chromeService = new ChromeService();
    let browser;

    try {
      // Start Chrome with debugging enabled
      await chromeService.startChrome();

      // Connect to Chrome and start processing
      const result = await browserService.connectToActiveTab();
      browser = result.browser;
      const page = result.page;

      // Run the selected generation type
      if (answer === '1') {
        await runSingleStyleGeneration(browserService, page);
      } else {
        await runMultiStyleGeneration(browserService, page);
      }

    } catch (error) {
      logger.error("Fatal error:", error);
    } finally {
      if (browser) {
        await browser.close();
        logger.info("Browser closed");
      }
      // Stop Chrome process
      await chromeService.stopChrome();
    }
  } catch (error) {
    logger.error("Unhandled error:", error);
  } finally {
    rl.close();
  }
}

// Run the application
main().catch((error) => {
  logger.error("Unhandled error:", error);
  process.exit(1);
}); 