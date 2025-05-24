const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

// Load items, prompt template, and functions from items.js
const { items, generatePrompt, generateMultiPrompt } = require('./data/items.js');

// const items = ["Compass", "Map", "Location pin"];
// const items = [
//   // Basic Tools
//   "Warning Sign"
// ];



// const generatePrompt = (item) =>
//   `Generate a high-resolution, smooth, clay-style icon of a ${item}. The icon should have a soft, sculpted clay appearance with a clean, polished surface — no fingerprints, no rough textures, and no visible clay dents.`;

async function isGenerating(page) {
  try {
    // Check for loading indicators or "Generating..." text
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

    // Check if the generate button is disabled
    const generateButton = await page.locator('button:has-text("Generate")');
    if (await generateButton.isDisabled()) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

async function waitForGeneration(page) {
  const maxAttempts = 12;
  for (let i = 0; i < maxAttempts; i++) {
    // First check if still generating
    if (await isGenerating(page)) {
      console.log("⏳ Still generating...");
      await page.waitForTimeout(10000);
      continue;
    }

    // Then check for images
    const images = await page.$$('img[alt="Generated image"]');
    const visible = [];
    for (const img of images) {
      if (await img.isVisible()) visible.push(img);
    }
    if (visible.length >= 2) {
      console.log("✅ Generation completed successfully");
      return true;
    }

    await page.waitForTimeout(10000);
  }
  throw new Error("Generation timeout: No images appeared after 2 minutes.");
}

async function connectToActiveTab() {
  const userDataDir =
    "C:\\Users\\ajeet\\AppData\\Local\\Google\\Chrome\\User Data\\Default";

  try {
    const browser = await chromium.connectOverCDP("http://localhost:9222");
    console.log("✅ Connected to Chrome");

    const defaultContext = browser.contexts()[0];
    const pages = defaultContext.pages();

    // Find active tab with Sora
    for (const page of pages) {
      const url = page.url();
      if (url.includes("sora.chatgpt.com")) {
        console.log(`✅ Found Sora tab: ${url}`);
        return { browser, page };
      }
    }

    // No Sora tab open, create one
    const page = await defaultContext.newPage();
    await page.goto("https://sora.chatgpt.com");
    await page.waitForLoadState("networkidle");
    console.log("🌐 Opened new Sora tab");
    return { browser, page };
  } catch (error) {
    console.error(
      "❌ Failed to connect to Chrome. Make sure Chrome is running with:"
    );
    console.error(
      `chrome.exe --remote-debugging-port=9222 --user-data-dir="${userDataDir}"`
    );
    throw error;
  }
}

async function focusTextarea(page) {
  try {
    const textarea = await page.locator("textarea");
    await textarea.click();
    console.log("✅ Focused textarea");
    await page.waitForTimeout(1000); // Short wait to ensure focus
    return true;
  } catch (error) {
    console.log("⚠️ Could not focus textarea");
    return false;
  }
}

async function clickEnterButton(page, maxRetries = 5) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // First check if still generating
      if (await isGenerating(page)) {
        console.log(
          `⏳ Waiting for previous generation to complete (attempt ${attempt}/${maxRetries})...`
        );
        await page.waitForTimeout(10000);
        continue;
      }

      // Focus textarea before trying to click the button
      await focusTextarea(page);

      // Try alternative selectors
      const alternativeSelectors = [
        'button:has-text("Generate")',
        'button:has-text("Enter")',
        'button[type="submit"]',
        "button.enter-button",
        "button.generate-button",
      ];

      for (const selector of alternativeSelectors) {
        const button = await page.locator(selector);
        if ((await button.isVisible()) && !(await button.isDisabled())) {
          await button.click();
          console.log(`✅ Clicked enter button using selector: ${selector}`);
          return true;
        }
      }
    } catch (error) {
      console.log(
        `⚠️ Attempt ${attempt}/${maxRetries} failed to find any enter button`
      );
    }

    if (attempt < maxRetries) {
      console.log(`⏳ Waiting before retry ${attempt + 1}/${maxRetries}...`);
      await page.waitForTimeout(5000);
    }
  }

  return false;
}

async function main() {
  let browser;
  try {
    const result = await connectToActiveTab();
    browser = result.browser;
    const page = result.page;

    // Generate images for all items
    for (const item of items) {
      console.log(`\n�� Processing: ${item}`);
      try {
        // Wait for any ongoing generation to complete
        while (await isGenerating(page)) {
          console.log("⏳ Waiting for previous generation to complete...");
          await page.waitForTimeout(5000);
        }

        // Focus textarea before entering prompt
        await focusTextarea(page);

        const prompt = generatePrompt(item);
        await page.fill("textarea", prompt);
        console.log("✍️ Prompt entered");

        // Try to click the enter button with retries
        const clicked = await clickEnterButton(page);
        if (!clicked) {
          throw new Error(
            "Could not find or click the enter button after multiple retries"
          );
        }
        console.log("🚀 Generation triggered...");

        // Wait for generation to complete
        await waitForGeneration(page);

        // Clear the prompt box and wait before next item
        await page.fill("textarea", "");
        await page.waitForTimeout(5000);
      } catch (err) {
        console.error(`❌ Error with "${item}":`, err.message);
        continue;
      }
    }
  } catch (err) {
    console.error("🔥 Fatal Error:", err.message);
  } finally {
    if (browser) await browser.close();
  }
}

main();
