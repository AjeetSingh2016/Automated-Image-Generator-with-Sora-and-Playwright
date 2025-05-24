interface Item {
  name: string;
  description: string;
}

export const promptTemplate: string;
export const items: Item[];
export function generatePrompt(item: Item): string;
export function generateMultiPrompt(items: Item[]): string; 