# Sora Image Generation Automation

A Playwright TypeScript-based automation tool for generating images using Sora (ChatGPT's image generation service). This tool automates the process of generating multiple images with consistent styling and prompt templates.

## Features

- Automated image generation using Sora
- Support for multiple image styles and prompt templates
- Robust error handling and logging
- Chrome browser automation using Playwright
- Configurable prompt templates and item lists
- Multi-style generation support

## Prerequisites

- Node.js (v14 or higher)
- Google Chrome browser
- TypeScript
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd sora-image-automation
```

2. Install dependencies:
```bash
npm install
```

3. Configure Chrome for remote debugging:
   - Close all Chrome instances
   - Launch Chrome with remote debugging enabled:
   ```bash
   chrome.exe --remote-debugging-port=9222 --user-data-dir="[path-to-chrome-data]"
   ```

## Project Structure

```
sora-image-automation/
├── src/                    # Source code
│   ├── config/            # Configuration files
│   ├── services/          # Core services
│   │   └── browser.service.ts
│   ├── utils/             # Utility functions
│   ├── generator.ts       # Main generator
│   ├── multi-style-generator.ts
│   └── index.ts           # Entry point
├── data/                  # Data files
│   └── items.js          # Item definitions and prompts
├── chrome-data/          # Chrome user data directory
├── dist/                 # Compiled JavaScript files
├── node_modules/         # Dependencies
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Dependencies

### Main Dependencies
- `playwright`: Browser automation
- `@playwright/test`: Testing framework
- `winston`: Logging
- `dotenv`: Environment variable management
- `node-fetch`: HTTP requests

### Development Dependencies
- `typescript`: TypeScript support
- `ts-node`: TypeScript execution
- `jest`: Testing
- `@types/*`: TypeScript type definitions

## Usage

1. Start Chrome with remote debugging:
```bash
chrome.exe --remote-debugging-port=9222 --user-data-dir="[path-to-chrome-data]"
```

2. Run the generator:
```bash
# Development mode
npm run dev

# Generate images
npm run generate


## Configuration
```

### Prompt Templates
Edit `data/items.js` to customize:
- Item list
- Prompt templates
- Generation parameters

## Scripts

- `npm run dev`: Run in development mode
- `npm run generate`: Generate images

## Error Handling

The application includes comprehensive error handling:
- Browser connection errors
- Generation timeouts
- Network issues
- UI interaction failures

Logs are stored in:
- `combined.log`: All logs
- `error.log`: Error logs only

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC License

## Support

For issues and feature requests, please create an issue in the repository. 