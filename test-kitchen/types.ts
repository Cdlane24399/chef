import { LanguageModelUsage, LanguageModel } from 'ai';

export type ChefModel = {
  name: string;
  model_slug: string;
  ai: LanguageModel;
  maxTokens: number;
};

export type ChefResult = {
  success: boolean;
  numDeploys: number;
  usage: LanguageModelUsage;
  files: Record<string, string>;
};
