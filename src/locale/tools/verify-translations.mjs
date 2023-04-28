#! /usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALE_PKG_DIR = path.resolve(dirname, "..");
const ALL_PATH = path.resolve(`${LOCALE_PKG_DIR}`, "all.json");
const all = JSON.parse(fs.readFileSync(ALL_PATH));

const languages = [
  "en-US",
  "it-IT",
  "zh-CN",
  "zh-TW",
  "ko-KR",
  "de-DE",
  "sv-SE",
  "es-ES",
  "pt-BR",
  "ja-JP",
  "fr-FR",
  "nl-NL",
  "tr-TR",
  "pl-PL",
  "ru-RU",
];

Object.keys(all).forEach((key) => {
  const supportLanguagesForString = Object.keys(all[key].locale);
  if (supportLanguagesForString.indexOf("en-US") === -1)
    // en-US must exist
    throw new Error(`String '${all[key].id}' is missing value for 'en-US'`);

  for (let i = 0; i < languages.length; i++) {
    if (supportLanguagesForString.indexOf(languages[i]) === -1)
      // eslint-disable-next-line no-console
      console.warn(`String '${all[key].id}' is missing value for '${languages[i]}'`);
  }
});
