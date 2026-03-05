import type { Timestamp } from 'firebase/firestore';

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  customResponses: Record<string, boolean>;
  createdAt: Timestamp;
};

export type Settings = {
  headline: string;
  description: string;
  whatsAppNumber: string;
  formQuestions: string[];
};
