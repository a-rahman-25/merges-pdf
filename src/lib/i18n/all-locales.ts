import enTranslations from './translations/en.json';
import enToolTranslations from './tool-translations/en.json';
import enFaqTranslations from './faq-translations/en.json';
import arTranslations from './translations/ar.json';
import arToolTranslations from './tool-translations/ar.json';
import arFaqTranslations from './faq-translations/ar.json';
import urTranslations from './translations/ur.json';
import urToolTranslations from './tool-translations/ur.json';
import urFaqTranslations from './faq-translations/ur.json';
import hiTranslations from './translations/hi.json';
import hiToolTranslations from './tool-translations/hi.json';
import hiFaqTranslations from './faq-translations/hi.json';
import bnTranslations from './translations/bn.json';
import bnToolTranslations from './tool-translations/bn.json';
import bnFaqTranslations from './faq-translations/bn.json';
import esTranslations from './translations/es.json';
import esToolTranslations from './tool-translations/es.json';
import esFaqTranslations from './faq-translations/es.json';
import ptBRTranslations from './translations/pt-BR.json';
import ptBRToolTranslations from './tool-translations/pt-BR.json';
import ptBRFaqTranslations from './faq-translations/pt-BR.json';
import frTranslations from './translations/fr.json';
import frToolTranslations from './tool-translations/fr.json';
import frFaqTranslations from './faq-translations/fr.json';
import deTranslations from './translations/de.json';
import deToolTranslations from './tool-translations/de.json';
import deFaqTranslations from './faq-translations/de.json';
import itTranslations from './translations/it.json';
import itToolTranslations from './tool-translations/it.json';
import itFaqTranslations from './faq-translations/it.json';
import nlTranslations from './translations/nl.json';
import nlToolTranslations from './tool-translations/nl.json';
import nlFaqTranslations from './faq-translations/nl.json';
import ruTranslations from './translations/ru.json';
import ruToolTranslations from './tool-translations/ru.json';
import ruFaqTranslations from './faq-translations/ru.json';
import trTranslations from './translations/tr.json';
import trToolTranslations from './tool-translations/tr.json';
import trFaqTranslations from './faq-translations/tr.json';
import zhTranslations from './translations/zh.json';
import zhToolTranslations from './tool-translations/zh.json';
import zhFaqTranslations from './faq-translations/zh.json';
import jaTranslations from './translations/ja.json';
import jaToolTranslations from './tool-translations/ja.json';
import jaFaqTranslations from './faq-translations/ja.json';
import koTranslations from './translations/ko.json';
import koToolTranslations from './tool-translations/ko.json';
import koFaqTranslations from './faq-translations/ko.json';
import idTranslations from './translations/id.json';
import idToolTranslations from './tool-translations/id.json';
import idFaqTranslations from './faq-translations/id.json';
import thTranslations from './translations/th.json';
import thToolTranslations from './tool-translations/th.json';
import thFaqTranslations from './faq-translations/th.json';
import viTranslations from './translations/vi.json';
import viToolTranslations from './tool-translations/vi.json';
import viFaqTranslations from './faq-translations/vi.json';
import swTranslations from './translations/sw.json';
import swToolTranslations from './tool-translations/sw.json';
import swFaqTranslations from './faq-translations/sw.json';
import type { Lang, TranslationMap } from '../translations';
import type { ToolTranslationMap } from '../tool-translations';
import type { FaqTranslationMap } from '../faq-translations';

export const allTranslations = {
  en: enTranslations,
  ar: arTranslations,
  ur: urTranslations,
  hi: hiTranslations,
  bn: bnTranslations,
  es: esTranslations,
  ptBR: ptBRTranslations,
  fr: frTranslations,
  de: deTranslations,
  it: itTranslations,
  nl: nlTranslations,
  ru: ruTranslations,
  tr: trTranslations,
  zh: zhTranslations,
  ja: jaTranslations,
  ko: koTranslations,
  id: idTranslations,
  th: thTranslations,
  vi: viTranslations,
  sw: swTranslations,
} as Record<Lang, TranslationMap>;

export const allToolTranslations = {
  en: enToolTranslations,
  ar: arToolTranslations,
  ur: urToolTranslations,
  hi: hiToolTranslations,
  bn: bnToolTranslations,
  es: esToolTranslations,
  ptBR: ptBRToolTranslations,
  fr: frToolTranslations,
  de: deToolTranslations,
  it: itToolTranslations,
  nl: nlToolTranslations,
  ru: ruToolTranslations,
  tr: trToolTranslations,
  zh: zhToolTranslations,
  ja: jaToolTranslations,
  ko: koToolTranslations,
  id: idToolTranslations,
  th: thToolTranslations,
  vi: viToolTranslations,
  sw: swToolTranslations,
} as Record<Lang, ToolTranslationMap>;

export const allFaqTranslations = {
  en: enFaqTranslations,
  ar: arFaqTranslations,
  ur: urFaqTranslations,
  hi: hiFaqTranslations,
  bn: bnFaqTranslations,
  es: esFaqTranslations,
  ptBR: ptBRFaqTranslations,
  fr: frFaqTranslations,
  de: deFaqTranslations,
  it: itFaqTranslations,
  nl: nlFaqTranslations,
  ru: ruFaqTranslations,
  tr: trFaqTranslations,
  zh: zhFaqTranslations,
  ja: jaFaqTranslations,
  ko: koFaqTranslations,
  id: idFaqTranslations,
  th: thFaqTranslations,
  vi: viFaqTranslations,
  sw: swFaqTranslations,
} as Record<Lang, FaqTranslationMap>;
