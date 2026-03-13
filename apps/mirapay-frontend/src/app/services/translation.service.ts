import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = signal('fr');
  private translations: any = { fr: {}, en: {}, es: {} };

  constructor() {
    this.loadTranslations();
  }

  async loadTranslations() {
    const langs = ['fr', 'en', 'es'];
    for (const lang of langs) {
      try {
        const response = await fetch(`/assets/i18n/${lang}.json`);
        this.translations[lang] = await response.json();
      } catch (e) {
        console.error(`Failed to load translations for ${lang}`, e);
      }
    }
  }

  get(key: string): string {
    const keys = key.split('.');
    let value = this.translations[this.currentLang()];
    for (const k of keys) {
      if (value) value = value[k];
    }
    return value || key;
  }

  setLanguage(lang: string) {
    this.currentLang.set(lang);
  }

  getLanguage() {
    return this.currentLang();
  }

  // Simple pipe-like method for templates
  translate(key: string) {
    return this.get(key);
  }
}
