import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = signal('fr');
  private translations = signal<any>({ fr: {}, en: {}, es: {} });

  constructor() {
    this.loadTranslations();
  }

  async loadTranslations() {
    const langs = ['fr', 'en', 'es'];
    const loadedTranslations: any = { fr: {}, en: {}, es: {} };
    
    for (const lang of langs) {
      try {
        const response = await fetch(`/i18n/${lang}.json`);
        if (!response.ok) throw new Error(`Status ${response.status}`);
        loadedTranslations[lang] = await response.json();
      } catch (e) {
        console.error(`Failed to load translations for ${lang}`, e);
      }
    }
    // Update the signal with all loaded translations
    this.translations.set(loadedTranslations);
  }

  translate(key: string): string {
    const lang = this.currentLang();
    const data = this.translations();
    
    const keys = key.split('.');
    let value = data[lang];
    
    for (const k of keys) {
      if (value) {
        value = value[k];
      } else {
        return key; // Return the key if not found
      }
    }
    
    return value || key;
  }

  setLanguage(lang: string) {
    this.currentLang.set(lang);
  }

  getLanguage() {
    return this.currentLang();
  }
}
