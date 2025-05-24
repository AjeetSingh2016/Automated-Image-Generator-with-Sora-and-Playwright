import { chromium, Browser, Page } from 'playwright';
import { logger } from '../utils/logger';

export class BrowserService {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async connectToActiveTab(): Promise<{ browser: Browser; page: Page }> {
    const userDataDir = process.env.CHROME_USER_DATA_DIR || "C:\\Users\\ajeet\\AppData\\Local\\Google\\Chrome\\User Data\\Default";

    try {
      const browser = await chromium.connectOverCDP("http://localhost:9222");
      logger.info("Connected to Chrome");

      const defaultContext = browser.contexts()[0];
      const pages = defaultContext.pages();

      // Find active tab with Sora
      for (const page of pages) {
        const url = page.url();
        if (url.includes("sora.chatgpt.com")) {
          logger.info(`Found Sora tab: ${url}`);
          return { browser, page };
        }
      }

      // No Sora tab open, create one
      const page = await defaultContext.newPage();
      await page.goto("https://sora.chatgpt.com");
      await page.waitForLoadState("networkidle");
      logger.info("Opened new Sora tab");
      return { browser, page };
    } catch (error) {
      logger.error("Failed to connect to Chrome. Make sure Chrome is running with:");
      logger.error(`chrome.exe --remote-debugging-port=9222 --user-data-dir="${userDataDir}"`);
      throw error;
    }
  }

  async isGenerating(page: Page): Promise<boolean> {
    try {
      const loadingIndicators = [
        'text="Generating..."',
        'text="Processing..."',
        'div[role="progressbar"]',
        "div.loading",
        "div.spinner",
        "div.animate-spin",
      ];

      for (const selector of loadingIndicators) {
        const element = await page.locator(selector);
        if (await element.isVisible()) {
          return true;
        }
      }

      const generateButton = await page.locator('button:has-text("Create image")');
      if (await generateButton.isDisabled()) {
        return true;
      }

      return false;
    } catch (error) {
      logger.error("Error checking generation status:", error);
      return false;
    }
  }

  async waitForGeneration(page: Page): Promise<boolean> {
    const maxAttempts = 12;
    for (let i = 0; i < maxAttempts; i++) {
      if (await this.isGenerating(page)) {
        logger.info("Still generating...");
        await page.waitForTimeout(10000);
        continue;
      }

      const images = await page.$$('img[alt="Generated image"]');
      const visible = [];
      for (const img of images) {
        if (await img.isVisible()) visible.push(img);
      }
      if (visible.length >= 2) {
        logger.info("Generation completed successfully");
        return true;
      }

      await page.waitForTimeout(10000);
    }
    throw new Error("Generation timeout: No images appeared after 2 minutes.");
  }

  async focusTextarea(page: Page): Promise<boolean> {
    try {
      const textarea = await page.locator("textarea");
      await textarea.click();
      logger.info("Focused textarea");
      await page.waitForTimeout(1000);
      return true;
    } catch (error) {
      logger.warn("Could not focus textarea");
      return false;
    }
  }

  async clickEnterButton(page: Page, maxRetries = 5): Promise<boolean> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (await this.isGenerating(page)) {
          logger.info(`Waiting for previous generation to complete (attempt ${attempt}/${maxRetries})...`);
          await page.waitForTimeout(10000);
          continue;
        }

        await this.focusTextarea(page);

        // Try the most reliable selectors first
        const primarySelectors = [
          'button:has-text("Create image")',
          'button[type="submit"]'
        ];

        for (const selector of primarySelectors) {
          try {
            const button = await page.locator(selector);
            if ((await button.isVisible()) && !(await button.isDisabled())) {
              await button.click();
              logger.info(`Clicked enter button using selector: ${selector}`);
              return true;
            }
          } catch (error) {
            logger.debug(`Selector ${selector} not found, trying next...`);
          }
        }

        // Fallback to the specific selector if needed
        const specificSelector = "body > main > div > div.pointer-events-none.fixed.inset-0 > div.absolute.bottom-2.left-1\\/2.hidden.w-full.max-w-\\[800px\\].-translate-x-1\\/2.px-3.tablet\\:block.tablet\\:left-\\[calc\\(var\\(--sidebar-width\\)\\+2\\*var\\(--sidebar-gap\\)\\+\\(100\\%-\\(var\\(--sidebar-width\\)\\+2\\*var\\(--sidebar-gap\\)\\)\\)\\/2\\)\\].tablet\\:w-\\[calc\\(100\\%-\\(var\\(--sidebar-width\\)\\+2\\*var\\(--sidebar-gap\\)\\)\\)\\].pointer-events-auto > div > div > div.flex.h-full.flex-col.gap-1\\.5 > div.flex.items-center.justify-between > div:nth-child(2) > button > span";
        const enterButton = await page.locator(specificSelector);
        if (await enterButton.isVisible()) {
          await enterButton.click();
          logger.info("Clicked enter button using specific selector");
          return true;
        }
      } catch (error) {
        logger.warn(`Attempt ${attempt}/${maxRetries} failed to find any enter button`);
      }

      if (attempt < maxRetries) {
        logger.info(`Waiting before retry ${attempt + 1}/${maxRetries}...`);
        await page.waitForTimeout(5000);
      }
    }

    return false;
  }
} 