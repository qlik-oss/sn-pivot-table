/* eslint-disable react/jsx-props-no-spreading  */
import ReactDOM from 'react-dom';
import React from 'react';
import { PivotTableProps, StickyPivotTable } from './components/PivotTable';
import SelectionsProvider from './contexts/SelectionsProvider';
import StyleProvider from './contexts/StyleProvider';
import { ExtendedSelections, StyleService } from '../types/types';
import { Root } from 'react-dom/client';

interface RootProps extends PivotTableProps {
  selections: ExtendedSelections;
  styleService: StyleService;
}

export function render(reactRoot: Root, props: RootProps): void {
  reactRoot.render(
    <React.StrictMode>
      <SelectionsProvider selections={props.selections}>
        <StyleProvider styleService={props.styleService}>
          <StickyPivotTable {...props} />
        </StyleProvider>
      </SelectionsProvider>
    </React.StrictMode>
  );
}
