#! /usr/bin/env node
import fs from "fs";
import { globbySync } from "globby";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const LOCALES_DIR = path.resolve(dirname, "../locales");
const LOCALES_FILES = globbySync([`${LOCALES_DIR}/*.json`]);
const LOCALE_PKG_DIR = path.resolve(dirname, "..");
const ALL = path.resolve(`${LOCALE_PKG_DIR}`, "all.json");

const LOCALES = {
  "en-US": "en-US",
  en: "en-US",
  de: "de-DE",
  fr: "fr-FR",
  it: "it-IT",
  ja: "ja-JP",
  ko: "ko-KR",
  nl: "nl-NL",
  pl: "pl-PL",
  pt: "pt-BR",
  ru: "ru-RU",
  sv: "sv-SE",
  tr: "tr-TR",
  "zh-CN": "zh-CN",
  "zh-TW": "zh-TW",
  es: "es-ES",
};

const merged = {};

LOCALES_FILES.forEach((file) => {
  const short = path.parse(file).name;
  const locale = LOCALES[short];
  const content = JSON.parse(fs.readFileSync(file, "utf8"));

  Object.keys(content).reduce((acc, curr) => {
    const key = curr.replace(/\./g, "_");
    if (!acc[key]) {
      acc[key] = {
        id: curr,
      };
    }
    if (!acc[key].locale) {
      acc[key].locale = {};
    }
    acc[key].locale[locale] = content[curr].value;
    return acc;
  }, merged);
});

fs.writeFileSync(ALL, JSON.stringify(merged, " ", 2));
