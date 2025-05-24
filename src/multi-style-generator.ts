import { BrowserService } from './services/browser.service';
import { ChromeService } from './services/chrome.service';
import { ConfigService } from './config/config.service';
import { logger } from './utils/logger';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  const browserService = new BrowserService();
  const chromeService = new ChromeService();
  const configService = ConfigService.getInstance();
  const prompts = configService.getPromptStrings();
  let browser;

  try {
    // Start Chrome with debugging enabled
    await chromeService.startChrome();

    // Connect to Chrome and start processing
    const result = await browserService.connectToActiveTab();
    browser = result.browser;
    const page = result.page;

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
}

// Run the application
main().catch((error) => {
  logger.error("Unhandled error:", error);
  process.exit(1);
}); 