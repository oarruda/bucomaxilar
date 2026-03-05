'use server';
/**
 * @fileOverview A Genkit flow for generating personalized initial WhatsApp reply templates for leads.
 *
 * - generatePersonalizedWhatsAppReply - A function that handles the generation of the reply template.
 * - GeneratePersonalizedWhatsAppReplyInput - The input type for the generatePersonalizedWhatsAppReply function.
 * - GeneratePersonalizedWhatsAppReplyOutput - The return type for the generatePersonalizedWhatsAppReply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedWhatsAppReplyInputSchema = z.object({
  leadName: z.string().describe('The full name of the lead.'),
  leadPhone: z.string().describe('The phone number of the lead.'),
  leadEmail: z.string().describe('The email address of the lead.'),
  customFormData: z
    .record(z.string(), z.string())
    .describe('An object containing custom form field keys and their string values.'),
});
export type GeneratePersonalizedWhatsAppReplyInput = z.infer<
  typeof GeneratePersonalizedWhatsAppReplyInputSchema
>;

const GeneratePersonalizedWhatsAppReplyOutputSchema = z.object({
  replyTemplate: z.string().describe('A personalized WhatsApp reply template for the lead.'),
});
export type GeneratePersonalizedWhatsAppReplyOutput = z.infer<
  typeof GeneratePersonalizedWhatsAppReplyOutputSchema
>;

export async function generatePersonalizedWhatsAppReply(
  input: GeneratePersonalizedWhatsAppReplyInput
): Promise<GeneratePersonalizedWhatsAppReplyOutput> {
  return generatePersonalizedWhatsAppReplyFlow(input);
}

const generatePersonalizedWhatsAppReplyPrompt = ai.definePrompt({
  name: 'generatePersonalizedWhatsAppReplyPrompt',
  input: {schema: GeneratePersonalizedWhatsAppReplyInputSchema},
  output: {schema: GeneratePersonalizedWhatsAppReplyOutputSchema},
  prompt: `You are an AI assistant helping a bucomaxilofacial doctor create personalized initial WhatsApp reply templates for potential clients.

The client, named {{{leadName}}}, has filled out a form with the following information:
{{#each customFormData}}
- {{{@key}}}: {{{this}}}
{{/each}}

Based on this information, generate a friendly and professional initial WhatsApp message template to engage with {{{leadName}}}.
The message should acknowledge their interest, reference the information they provided in the form to make it personalized, and encourage them to schedule a consultation.

Start the message directly with the greeting, do not include any introductory phrases like "Here is a personalized reply:"

Example:
"Olá [Nome do Cliente], obrigado por seu interesse em nossos serviços. Entendemos que você está buscando [mencionar algo do formulário]. Gostaríamos de conversar mais sobre como podemos ajudar. Por favor, nos diga o melhor horário para agendarmos uma consulta."`,
});

const generatePersonalizedWhatsAppReplyFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedWhatsAppReplyFlow',
    inputSchema: GeneratePersonalizedWhatsAppReplyInputSchema,
    outputSchema: GeneratePersonalizedWhatsAppReplyOutputSchema,
  },
  async input => {
    const {output} = await generatePersonalizedWhatsAppReplyPrompt(input);
    return output!;
  }
);
