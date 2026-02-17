import { convertToModelMessages } from 'ai';
import type { UIMessage } from 'ai';
import { EXCLUDED_FILE_PATHS } from './constants.js';

export async function cleanupAssistantMessages(messages: UIMessage[]) {
  let processedMessages = messages.map((message) => {
    if (message.role == 'assistant') {
      const parts = message.parts?.map((part) => {
        if (part.type === 'text') {
          return { ...part, text: cleanMessage(part.text) };
        }
        return part;
      });
      return { ...message, parts };
    } else {
      return message;
    }
  });
  // Filter out empty messages and messages with empty parts
  processedMessages = processedMessages.filter(
    (message) =>
      message.parts && message.parts.filter((part) => part.type === 'text' || part.type.startsWith('tool-')).length > 0,
  );
  return (await convertToModelMessages(processedMessages)).filter((message) => {
    if (typeof message.content === 'string') {
      return message.content.length > 0;
    }
    if (Array.isArray(message.content)) {
      return message.content.length > 0;
    }
    return true;
  });
}

function cleanMessage(message: string) {
  message = message.replace(/<div class=\\"__boltThought__\\">.*?<\/div>/s, '');
  message = message.replace(/<think>.*?<\/think>/s, '');
  // We prevent the LLM from modifying a list of files
  for (const excludedPath of EXCLUDED_FILE_PATHS) {
    const escapedPath = excludedPath.replace(/\//g, '\\/');
    message = message.replace(
      new RegExp(`<boltAction type="file" filePath="${escapedPath}"[^>]*>[\\s\\S]*?<\\/boltAction>`, 'g'),
      `You tried to modify \`${excludedPath}\` but this is not allowed. Please modify a different file.`,
    );
  }
  return message;
}
