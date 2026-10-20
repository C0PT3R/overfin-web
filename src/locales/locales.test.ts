// Every language says the same things: the same keys (the type check sees
// to that) and, in each text, the same {values}.
import { describe, expect, it } from 'vitest';
import en from './en';
import fr from './fr';

const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe('translations', () => {
  for (const [name, catalog] of Object.entries({ fr })) {
    it(`${name} fills in the same values as English`, () => {
      for (const key of Object.keys(en) as (keyof typeof en)[]) {
        expect(placeholders(catalog[key]), `${name} ${key}`).toEqual(placeholders(en[key]));
      }
    });
    it(`${name} has no empty text`, () => {
      for (const [key, text] of Object.entries(catalog)) expect(text.trim(), `${name} ${key}`).not.toBe('');
    });
  }
});
