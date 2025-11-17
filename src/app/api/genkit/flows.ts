import { genkit } from 'genkit';
import { configure } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';
import { dotprompt } from '@genkit-ai/dotprompt';
import { firebase } from '@genkit-ai/firebase';
import * as z from 'zod';
import { createProjectFlow, editorChat } from './projectFlows'; // Make sure both flows are imported

configure({
  plugins: [
    googleAI(),
    dotprompt(),
firebase(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export const helloFlow = genkit.flow(
  {
    name: 'helloFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (name) => {
    return `Hello, ${name}!`;
  }
);

// Add both flows to the list of exported flows
export const flows = [helloFlow, createProjectFlow, editorChat];
