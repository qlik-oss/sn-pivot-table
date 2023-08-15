import { useMemo, useTranslator } from "@nebula.js/stardust";
import registerLocale from "../locale/src";
import type { ExtendedTranslator } from "../types/types";

const useTranslations = () => {
  const translator = useTranslator() as ExtendedTranslator;
  const language = translator.language();

  useMemo(() => registerLocale(translator), [translator, language]);

  return { translator, language };
};

export default useTranslations;
