import { tool } from 'ai';
import { presenceComponentReadmePrompt } from '../prompts/components/presence.js';
import { proseMirrorComponentReadmePrompt } from '../prompts/components/proseMirror.js';
import { z } from 'zod';
import { resendComponentReadmePrompt } from '../prompts/components/resend.js';

export const lookupDocsParameters = z.object({
  docs: z
    .array(z.string())
    .describe(
      'List of features to look up in the documentation. You should look up all the docs for the features you are implementing.',
    ),
});

export function lookupDocsTool() {
  return tool({
    description: `Lookup documentation for a list of features. Valid features to lookup are: \`proseMirror\` and \`presence\``,
    inputSchema: lookupDocsParameters,
  });
}

export type LookupDocsParameters = z.infer<typeof lookupDocsParameters>;

// Documentation content that can be looked up
export const docs = {
  proseMirror: proseMirrorComponentReadmePrompt,
  presence: presenceComponentReadmePrompt,
  resend: resendComponentReadmePrompt,
} as const;

export type DocKey = keyof typeof docs;
