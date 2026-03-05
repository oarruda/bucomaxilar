'use server';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Settings } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const SETTINGS_DOC_ID = 'landingPage';
const SETTINGS_COLLECTION = 'settings';

const defaultSettings: Settings = {
  headline: 'Cuide do seu sorriso. Ele é o seu cartão de visitas.',
  description: 'Oferecemos tratamentos de ponta em um ambiente moderno e acolhedor. Agende sua avaliação e descubra como podemos transformar seu sorriso.',
  whatsAppNumber: '5511999999999',
  formQuestions: [
    'Implantes Dentários',
    'Clareamento Dental',
    'Extração de Siso',
    'Harmonização Orofacial',
  ],
};

export async function getSettings(): Promise<Settings> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Settings;
    } else {
      // If no settings exist, create them with default values
      await setDoc(docRef, defaultSettings);
      return defaultSettings;
    }
  } catch (error) {
    console.error("Error fetching settings, returning default. Error: ", error);
    return defaultSettings;
  }
}

export async function updateSettings(newSettings: Settings) {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await setDoc(docRef, newSettings, { merge: true });
    
    // Revalidate both the home page and the settings page
    revalidatePath('/');
    revalidatePath('/admin/settings');
    
    return { success: true, message: 'Configurações salvas com sucesso!' };
  } catch (error) {
    console.error("Error updating settings: ", error);
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
    return { success: false, error: `Falha ao salvar configurações: ${errorMessage}` };
  }
}
