import { logger } from '../utils/logger';
import { items, promptTemplate, generatePrompt, generateMultiPrompt } from '../../data/items';
import { prompts } from '../../data/prompts';

interface Item {
  name: string;
  description: string;
}

interface Prompt {
  name: string;
  prompt: string;
}

export class ConfigService {
  private static instance: ConfigService;
  private readonly items: Item[];
  private readonly prompts: Prompt[];
  private readonly defaultPromptTemplate: string;

  private constructor() {
    this.items = items;
    this.prompts = prompts;
    this.defaultPromptTemplate = promptTemplate;
    logger.info('Configuration loaded successfully');
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public getItems(): Item[] {
    return this.items;
  }

  public getPrompts(): Prompt[] {
    return this.prompts;
  }

  public generatePrompt(item: Item): string {
    return generatePrompt(item);
  }

  public generateMultiPrompt(items: Item[]): string {
    return generateMultiPrompt(items);
  }

  public getPromptStrings(): string[] {
    return this.prompts.map(p => p.prompt);
  }
} 