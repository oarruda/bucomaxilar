"use server";

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

interface SaveLeadPayload {
  leadData: {
    name: string;
    email: string;
    phone: string;
  };
  customResponses: {
    question: string;
    answered: boolean;
  }[];
  whatsAppNumber: string;
}

export async function saveLeadAndCreateWhatsAppLink(payload: SaveLeadPayload) {
  try {
    const { leadData, customResponses, whatsAppNumber } = payload;
    
    const customResponsesMap: Record<string, boolean> = {};
    customResponses.forEach(res => {
      if(res.answered) {
        customResponsesMap[res.question] = res.answered;
      }
    });

    // Save to Firestore
    await addDoc(collection(db, 'leads'), {
      ...leadData,
      customResponses: customResponsesMap,
      createdAt: serverTimestamp(),
    });
    
    revalidatePath('/admin/leads');

    // Create WhatsApp message and link
    const interests = customResponses
      .filter(res => res.answered)
      .map(res => res.question)
      .join(', ');

    let message = `Olá, meu nome é ${leadData.name}. Meu email é ${leadData.email} e telefone ${leadData.phone}.`;
    if (interests) {
      message += ` Tenho interesse em: ${interests}.`;
    }

    const encodedMessage = encodeURIComponent(message);
    const cleanWhatsAppNumber = whatsAppNumber.replace(/\D/g, '');
    const url = `https://wa.me/${cleanWhatsAppNumber}?text=${encodedMessage}`;

    return { success: true, url };
  } catch (error) {
    console.error('Error saving lead or creating WhatsApp link:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: `Failed to process lead: ${errorMessage}` };
  }
}
