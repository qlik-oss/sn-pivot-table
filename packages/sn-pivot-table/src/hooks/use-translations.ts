import { useMemo, useTranslator } from "@nebula.js/stardust";
import registerLocale from "../locale/src";

const useTranslations = () => {
  const translator = useTranslator();
  const language = translator.language();

  useMemo(() => registerLocale(translator), [translator]);

  return { translator, language };
};

export default useTranslations;
