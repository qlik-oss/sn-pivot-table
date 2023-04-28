import { stardust } from "@nebula.js/stardust";

import all from "../all.json";

export default function registerLocale(translator: stardust.Translator) {
  if (translator.get && translator.add) {
    const t = "SNPivotTable_LimitedData";
    const g = translator.get(t);

    // if the translated string is different from its id,
    // the translations are assumed to already exist for the current locale
    if (g !== t) return;

    Object.keys(all).forEach((key): void => {
      translator.add(all[key as keyof typeof all]);
    });
  }
}
