import React, { createContext, useContext } from 'react';
// import useDebug from '../hooks/use-debug';
import { StyleService } from '../../types/types';


interface StyleProviderProps {
  children: JSX.Element | JSX.Element[],
  styleService: StyleService;
}

const NOOP_STYLE_SERVICE = {} as StyleService;

const StyleContext = createContext<StyleService>(NOOP_STYLE_SERVICE);

export const useStyleContext = (): StyleService => useContext(StyleContext);

export default function StyleProvider({ children, styleService }: StyleProviderProps): JSX.Element {
  // useDebug('StyleProvider', { ...styleService });

  return (
    <StyleContext.Provider value={styleService}>
      {children}
    </StyleContext.Provider>
  );
}
