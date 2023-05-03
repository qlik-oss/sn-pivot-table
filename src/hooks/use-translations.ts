import { useEffect, useTranslator } from "@nebula.js/stardust";
import registerLocale from "../locale/src";
import { ExtendedTranslator } from "../types/types";

export const useTranslations = () => {
  const translator = useTranslator() as ExtendedTranslator;
  const language = translator.language();

  useEffect(() => registerLocale(translator), [translator, language]);

  return { translator, language };
};
